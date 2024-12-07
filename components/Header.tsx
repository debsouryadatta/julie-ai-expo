import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGlobalStore } from '@/store/useStore';
import ApiKeysDialog from './ApiKeysDialog';
import SettingsDialog from './SettingsDialog';

export default function Header() {
  const { setIsApiKeysDialogOpen, setIsSettingsDialogOpen } = useGlobalStore();

  return (
    <>
      <View className="flex-row items-center justify-between px-4 py-3 bg-black border-b border-[#333333]">
        <View className="flex-row items-center">
          <View className="h-10 w-10 rounded-full overflow-hidden mr-3">
            <Image
              source={{ uri: "https://res.cloudinary.com/diyxwdtjd/image/upload/v1727810716/projects/julie_gez2o2.png" }}
              className="h-full w-full"
            />
          </View>
          <Text className="text-white text-xl font-semibold">Julie ♥</Text>
        </View>
        <View className="flex-row">
          <TouchableOpacity 
            className="bg-[#2D2D2D] px-4 py-2 rounded-full flex-row items-center mr-2"
            onPress={() => setIsApiKeysDialogOpen(true)}
          >
            <Ionicons name="key" size={16} color="white" className="mr-1" />
            <Text className="text-white -mt-1">Api Keys</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-[#2D2D2D] px-4 py-2 rounded-full flex-row items-center"
            onPress={() => setIsSettingsDialogOpen(true)}
          >
            <Ionicons name="settings" size={14} color="white" className="mr-1" />
            <Text className="text-white -mt-1">settings</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ApiKeysDialog />
      <SettingsDialog />
    </>
  );
}
