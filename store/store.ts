import { create } from 'zustand';
import { Subscription } from '@/types/Subscription';

export type LanguagesSupported =
    | "en"
    | "vi"
    | "zh-CN"
    | "zh-TW"
    | "es"
    | "de"
    | "fr"
    | "th"
    | "ru"
    | "ko"
    | "ja"
    | "it"
    | "id"
    | "de";

export const LanguagesSupportedMap: Record<LanguagesSupported, string> = {
    en: "English",
    vi: "Vietnamese",
    "zh-CN": "Chinese (Simplified)",
    "zh-TW": "Chinese (Traditional)",
    fr: "French",
    de: "German",
    id: "Indonesian",
    it: "Italian",
    ja: "Japanese",
    ko: "Korean",
    th: "Thai",
    ru: "Russian",
    es: "Spanish",
};

const LANGUAGES_IN_FREE = 2;

interface LanguagesState {
    language: LanguagesSupported;
    setLanguage: (language: LanguagesSupported) => void;
    getLanguages: (isPro: boolean) => LanguagesSupported[];
    getNotSupportedLanguages: (isPro: boolean) => LanguagesSupported[];
}

export const useLanguageStore = create<LanguagesState>((set) => ({
    language: "en",
    setLanguage: (language) => set({ language }),
    getLanguages: (isPro: boolean) => {
        if (isPro)
            return Object.keys(LanguagesSupportedMap) as LanguagesSupported[];

        return Object.keys(LanguagesSupportedMap).slice(0, LANGUAGES_IN_FREE) as LanguagesSupported[];
    },
    getNotSupportedLanguages: (isPro: boolean) => {
        if (isPro) return [];

        return Object.keys(LanguagesSupportedMap).slice(LANGUAGES_IN_FREE) as LanguagesSupported[];
    },
}));

interface SubscriptionState {
    subscription: Subscription | null | undefined;
    setSubscription: (subscription: Subscription | null) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
    subscription: undefined,
    setSubscription: (subscription: Subscription | null) => set({ subscription }),
}));