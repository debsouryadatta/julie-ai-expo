import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useGlobalStore } from '@/store/useStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function SettingsDialog() {
  const { isSettingsDialogOpen, setIsSettingsDialogOpen, messages, setMessages } = useGlobalStore();
  const [selectedProvider, setSelectedProvider] = React.useState('groq');

  const handleClearHistory = () => {
    AsyncStorage.setItem('messages', JSON.stringify([]));
    setMessages([]);
    Toast.show({
      type: 'success',
      text1: 'Chat history cleared',
    })
    setIsSettingsDialogOpen(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isSettingsDialogOpen}
      onRequestClose={() => setIsSettingsDialogOpen(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-[#1E1E1E] p-6 rounded-2xl w-[90%] max-w-[400px]">
          <Text className="text-white text-xl font-semibold mb-4">Settings</Text>
          
          {/* <View className="mb-6">
            <Text className="text-white mb-2">Provider</Text>
            <View className="bg-[#2D2D2D] rounded-lg overflow-hidden">
              <Picker
                selectedValue={selectedProvider}
                onValueChange={(itemValue) => setSelectedProvider(itemValue)}
                style={{ color: 'white', backgroundColor: '#2D2D2D' }}
              >
                <Picker.Item label="Groq" value="groq" />
                <Picker.Item label="OpenAI" value="openai" />
                <Picker.Item label="Anthropic" value="anthropic" />
              </Picker>
            </View>
          </View> */}

          <TouchableOpacity
            onPress={handleClearHistory}
            className="bg-red-600/20 mb-6 px-4 py-3 rounded-lg flex-row items-center justify-center"
          >
            <Text className="text-red-500 font-medium">Clear Chat History</Text>
          </TouchableOpacity>

          <View className="flex-row justify-end">
            <TouchableOpacity
              onPress={() => setIsSettingsDialogOpen(false)}
              className="bg-blue-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}