import { create } from 'zustand';
import { Audio } from "expo-av";
import { Message } from '@/lib/types';

interface GlobalState {
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    isRecording: boolean;
    setIsRecording: (isRecording: boolean) => void;
    recording: Audio.Recording | null;
    setRecording: (recording: Audio.Recording | null) => void;
    groqApiKey: string;
    setGroqApiKey: (key: string) => void;
    elevenLabsApiKey: string;
    setElevenLabsApiKey: (key: string) => void;
    isApiKeysDialogOpen: boolean;
    setIsApiKeysDialogOpen: (isOpen: boolean) => void;
    isSettingsDialogOpen: boolean;
    setIsSettingsDialogOpen: (isOpen: boolean) => void;
    aiResponseLoading: boolean;
    setAiResponseLoading: (aiResponseLoading: boolean) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
    messages: [],
    setMessages: (messages) => set({ messages }),

    isRecording: false,
    setIsRecording: (isRecording) => set({ isRecording }),

    recording: null,
    setRecording: (recording) => set({ recording }),

    groqApiKey: '',
    setGroqApiKey: (key) => set({ groqApiKey: key }),

    elevenLabsApiKey: '',
    setElevenLabsApiKey: (key) => set({ elevenLabsApiKey: key }),

    isApiKeysDialogOpen: false,
    setIsApiKeysDialogOpen: (isOpen) => set({ isApiKeysDialogOpen: isOpen }),

    isSettingsDialogOpen: false,
    setIsSettingsDialogOpen: (isOpen) => set({ isSettingsDialogOpen: isOpen }),
    
    aiResponseLoading: false,
    setAiResponseLoading: (aiResponseLoading) => set({ aiResponseLoading }),
}));