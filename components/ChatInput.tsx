import React from 'react';
import { View, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ChatInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
};

export default function ChatInput({ value, onChangeText, onSend }: ChatInputProps) {
  return (
    <View className="px-4 py-4 bg-[#14141A]">
      <View className="flex-row items-center bg-[#1E1E26] rounded-3xl px-4 py-2.5 shadow-xl">
        {/* <TouchableOpacity className="mr-3 opacity-80 active:opacity-60">
          <Ionicons name="add-circle-outline" size={24} color="#8E8E93" />
        </TouchableOpacity> */}
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Message Julie..."
          placeholderTextColor="#8E8E93"
          className="flex-1 text-white text-base min-h-[44px] leading-[22px] active:border-none focus:outline-none"
          // multiline
        />
          <TouchableOpacity
            onPress={onSend}
            className="ml-3 h-10 w-10 rounded-full bg-[#4B3BFF] items-center justify-center shadow-lg shadow-[#4B3BFF]/30 active:opacity-80"
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
      </View>
    </View>
  );
}