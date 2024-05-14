import { create } from 'zustand';
import { Subscription } from '@/types/Subscription';

export type LanguagesSupported =
    | "en"
    | "es"
    | "de"
    | "fr"
    | "vi"
    | "th"
    | "ru"
    | "ko"
    | "ja"
    | "it"
    | "id"
    | "de"
    | "zh-CN"
    | "zh-TW";

export const LanguagesSupportedMap: Record<LanguagesSupported, string> = {
    en: "English",
    es: "Spanish",
    de: "German",
    fr: "French",
    vi: "Vietnamese",
    th: "Thai",
    ru: "Russian",
    ko: "Korean",
    ja: "Japanese",
    it: "Italian",
    id: "Indonesian",
    "zh-CN": "Chinese (Simplified)",
    "zh-TW": "Chinese (Traditional)",
};

interface SubscriptionState {
    subscription: Subscription | null | undefined;
    setSubscription: (subscription: Subscription | null) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
    subscription: undefined,
    setSubscription: (subscription: Subscription | null) => set({ subscription }),
}));