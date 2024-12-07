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
    if(!groqApiKey || !elevenLabsApiKey) {
      Toast.show({
        type: 'error',
        text1: 'Please enter the API Keys',
      })
      return;
    }
    const hasPermission = await getMicrophonePermission();
    if (!hasPermission) return;
    if (recording) {
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
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
        text2: 'Failed to stop recording',
      })
    }
  };

  // Speak the response given by llm
  const speakText = async (text: string) => {
    try {
      if (Platform.OS === 'ios') {
        const options = {
          voice: "com.apple.ttsbundle.Samantha-compact",
          language: "en-US",
          pitch: 1.5,
          rate: 1,
        };
        Speech.speak(text, options);
      } else if (Platform.OS === 'android') {
        const options = {
          language: "en-US",
          pitch: 1.5,
          rate: 1,
        };
        Speech.speak(text, options);
      } else if (Platform.OS === 'web') {
        // Web Speech API
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.pitch = 1.5;
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.log('Error speaking text:', error);
      Toast.show({
        type: 'error',
        text1: 'Speech Error',
        text2: 'Unable to speak the text'
      });
    }
  };  

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