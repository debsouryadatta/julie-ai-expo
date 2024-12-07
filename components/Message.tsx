import React from 'react';
import { View, Text, Image } from 'react-native';

type MessageProps = {
  text: string;
  isUser?: boolean;
  avatar?: string;
};

export default function Message({ text, isUser = false, avatar }: MessageProps) {
  return (
    <View className={`flex-row ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <View className="h-10 w-10 rounded-full overflow-hidden mr-2">
          <Image
            source={{ uri: "https://res.cloudinary.com/diyxwdtjd/image/upload/v1727810716/projects/julie_gez2o2.png" }}
            className="h-full w-full"
          />
        </View>
      )}
      <View
        className={`max-w-[80%] rounded-2xl p-3 ${
          isUser
            ? 'bg-[#4B3BFF] rounded-tr-none mr-2'
            : 'bg-[#1E1E1E] rounded-tl-none ml-2'
        }`}
      >
        <Text className="text-white text-base">{text}</Text>
      </View>
      {isUser && (
        <View className="h-10 w-10 rounded-full overflow-hidden ml-2">
          <Image
            source={{uri: "https://github.com/shadcn.png"}}
            className="h-full w-full"
          />
        </View>
      )}
    </View>
  );
}
