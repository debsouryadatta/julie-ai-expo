import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { useGlobalStore } from '@/store/useStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function ApiKeysDialog() {
  const {
    groqApiKey,
    setGroqApiKey,
    elevenLabsApiKey,
    setElevenLabsApiKey,
    isApiKeysDialogOpen,
    setIsApiKeysDialogOpen,
  } = useGlobalStore();

  const handleSave = async () => {
    setIsApiKeysDialogOpen(false);
    await AsyncStorage.setItem('groqApiKey', groqApiKey);
    await AsyncStorage.setItem('elevenLabsApiKey', elevenLabsApiKey);
    Toast.show({
      type: 'success',
      text1: 'API Keys saved',
    })
  };

  useEffect(() => {
    const getKeys = async () => {
      const groqKey = await AsyncStorage.getItem('groqApiKey');
      const elevenLabsKey = await AsyncStorage.getItem('elevenLabsApiKey');
      if (groqKey) setGroqApiKey(groqKey);
      if (elevenLabsKey) setElevenLabsApiKey(elevenLabsKey);
    };
    getKeys();
  }, []);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isApiKeysDialogOpen}
      onRequestClose={() => setIsApiKeysDialogOpen(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-[#1E1E1E] p-6 rounded-2xl w-[90%] max-w-[400px]">
          <Text className="text-white text-xl font-semibold mb-4">API Keys</Text>
          
          <View className="mb-4">
            <Text className="text-white mb-2">Groq API Key</Text>
            <TextInput
              className="bg-[#2D2D2D] text-white p-3 rounded-lg"
              placeholder="Enter Groq API Key"
              placeholderTextColor="#666"
              value={groqApiKey}
              onChangeText={setGroqApiKey}
              secureTextEntry
            />
          </View>

          <View className="mb-6">
            <Text className="text-white mb-2">ElevenLabs API Key</Text>
            <TextInput
              className="bg-[#2D2D2D] text-white p-3 rounded-lg"
              placeholder="Enter ElevenLabs API Key"
              placeholderTextColor="#666"
              value={elevenLabsApiKey}
              onChangeText={setElevenLabsApiKey}
              secureTextEntry
            />
          </View>

          <View className="flex-row justify-end space-x-3">
            <TouchableOpacity
              onPress={() => setIsApiKeysDialogOpen(false)}
              className="bg-[#2D2D2D] px-4 py-2 rounded-lg"
            >
              <Text className="text-white">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              className="bg-blue-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}