import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/Header';
import Message from '../../components/Message';
import Recorder from '../../components/Recorder';
import { useGlobalStore } from '@/store/useStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function Home() {
  const { messages, setMessages, aiResponseLoading } = useGlobalStore();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      if (messages.length > 0) {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    }, 100);
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      let storedMessages = await AsyncStorage.getItem('messages');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages).slice(-30));
      } else {
        Toast.show({
          type: 'info',
          text1: 'Start a conversation',
        })
      }
    };
    getMessages();
  }, [])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#14141A] h-screen w-screen"
    >
      <Header />
      <LinearGradient
        colors={['#111111', '#111232', '#4B6BFB']}
        className="flex-1"
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 pt-4"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.map((message, index) => (
            <Message
              key={index}
              text={message.content}
              isUser={message.role === "user"}
            />
          ))}
        </ScrollView>
        {aiResponseLoading && (
          <View className="absolute inset-0 bg-black/50 items-center justify-center">
            <ActivityIndicator size="large" color="#4B6BFB" />
          </View>
        )}
      </LinearGradient>
      <Recorder />
    </KeyboardAvoidingView>
  );
}