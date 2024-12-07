import React, { useState } from 'react';
import { TouchableOpacity, View, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import Toast from 'react-native-toast-message';
import { useGlobalStore } from '@/store/useStore';
import { sendAudioToWhisper } from '@/lib/stt';
import { sendToGpt } from '@/lib/llm';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Recorder() {
  const { isRecording, setIsRecording, recording, setRecording, messages, setMessages, groqApiKey, elevenLabsApiKey } = useGlobalStore();

  const handlePress = () => {
    if(!groqApiKey || !elevenLabsApiKey) {
      Toast.show({
        type: 'error',
        text1: 'Please enter the API Keys',
      })
      return;
    }
    setIsRecording(!isRecording);
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // get microphone permission
  const getMicrophonePermission = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();

      if (!granted) {
        Toast.show({
          type: 'error',
          text1: 'Permission',
          text2: 'Please grant permission to access microphone',
          visibilityTime: 3000,
          autoHide: true,
        })
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Recording options
  const recordingOptions: any = {
    android: {
      extension: ".wav",
      outPutFormat: Audio.AndroidOutputFormat.MPEG_4,
      androidEncoder: Audio.AndroidAudioEncoder.AAC,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: ".wav",
      audioQuality: Audio.IOSAudioQuality.HIGH,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
    web: {
      extension: ".wav",
      mimeType: "audio/webm",
      bitsPerSecond: 128000,
    }
  };

  // Start recording
  const startRecording = async () => {
    const hasPermission = await getMicrophonePermission();
    if (!hasPermission) return;
    if (recording) {
      if (Platform.OS === 'web') {
        window.speechSynthesis.pause();
        window.speechSynthesis.cancel();
      } else {
        Speech.stop();
      }
    }
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        // interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        // interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      });
      setIsRecording(true);
      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(recording);
    } catch (error) {
      console.log("Failed to start Recording", error);
      Toast.show({
        type: 'error',
        text2: 'Failed to start recording',
      })
    }
  };

  // Stop recording
  const stopRecording = async () => {
    
    try {
      setIsRecording(false);
      await recording?.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
        // interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        // interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      });

      const uri = recording?.getURI();

      // Speech to text
      const transcript = await sendAudioToWhisper(uri!, groqApiKey);
      console.log("Transcript:", transcript);
      const updatedMessages = [...messages, { role: "user", content: transcript }];

      const llmResponse = await sendToGpt(updatedMessages, groqApiKey);
      console.log("LLM Response:", llmResponse);
      setMessages([...updatedMessages, { role: "assistant", content: llmResponse }]);

      await speakText(llmResponse);
      AsyncStorage.setItem('messages', JSON.stringify([...updatedMessages, { role: "assistant", content: llmResponse }]));
      
    } catch (error) {
      console.log("Failed to stop Recording", error);
      Toast.show({
        type: 'error',
        text1: 'Failed to stop recording',
      })
    }
  };

  const speakText = async (text: string) => {
    try {
      const voiceId = "cgSgspJ2msm6clMCkdW9"; // Jessica voice
      const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            language_code: "hi",
          }
        }),
      });

      if (!response.ok) {
        console.error("Error fetching audio:", response.statusText);
        Toast.show({
          type: 'error',
          text1: 'ElevenLabs Error',
          text2: 'Failed to generate speech'
        });
        return;
      }

      let audioUri: string;

      if (Platform.OS === 'web') {
        const audioBlob = await response.blob();
        audioUri = URL.createObjectURL(audioBlob);
      } else {
        // For iOS and Android - using chunked processing
        const arrayBuffer = await response.arrayBuffer();
        const chunks = [];
        const chunkSize = 8192; // Process 8KB at a time
        const uint8Array = new Uint8Array(arrayBuffer);
        
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.slice(i, i + chunkSize);
          chunks.push(String.fromCharCode.apply(null, Array.from(chunk)));
        }
        
        const base64String = btoa(chunks.join(''));
        audioUri = `data:audio/mpeg;base64,${base64String}`;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) {
          await sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("Error in text-to-speech:", error);
      Toast.show({
        type: 'error',
        text1: 'Speech Error',
        text2: 'Unable to play audio'
      });
    }
  }

  return (
    <View className="px-4 py-4 bg-[#14141A]">
      <View className="items-center">
        <TouchableOpacity
          onPress={handlePress}
          className={`
                        w-16 h-16 rounded-full items-center justify-center
                        ${isRecording ? 'bg-red-500' : 'bg-[#4B3BFF]'}
                        shadow-lg active:opacity-80
                    `}
        >
          <Ionicons
            name={isRecording ? "stop" : "mic"}
            size={28}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}