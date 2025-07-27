import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface PopupState {
    // History UI state
    isHistoryExpanded: boolean;
    setHistoryExpanded: (expanded: boolean) => void;
    
    // Loading and error states
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    
    error: string | null;
    setError: (error: string | null) => void;
    
    // Tab and URL state
    currentTab: chrome.tabs.Tab | null;
    setCurrentTab: (tab: chrome.tabs.Tab | null) => void;
    
    plainUrl: string;
    setPlainUrl: (url: string) => void;
    
    urlParts: [boolean, string][];
    setUrlParts: (parts: [boolean, string][]) => void;
    
    // Placeholder form state
    placeholderValueMap: Record<string, string>;
    setPlaceholderValueMap: (map: Record<string, string>) => void;
    updatePlaceholderValue: (key: string, value: string) => void;
    
    // Computed getters
    hasPlaceholders: () => boolean;
    isFormValid: () => boolean;
    
    // Reset functions
    resetState: () => void;
    resetError: () => void;
}

export const usePopupStore = create<PopupState>()(
    immer((set, get) => ({
        // History UI state
        isHistoryExpanded: false,
        setHistoryExpanded: (expanded) => set((state) => {
            state.isHistoryExpanded = expanded;
        }),
        
        // Loading and error states
        isLoading: true,
        setIsLoading: (loading) => set((state) => {
            state.isLoading = loading;
        }),
        
        error: null,
        setError: (error) => set((state) => {
            state.error = error;
        }),
        
        // Tab and URL state
        currentTab: null,
        setCurrentTab: (tab) => set((state) => {
            state.currentTab = tab;
        }),
        
        plainUrl: "",
        setPlainUrl: (url) => set((state) => {
            state.plainUrl = url;
        }),
        
        urlParts: [],
        setUrlParts: (parts) => set((state) => {
            state.urlParts = parts;
        }),
        
        // Placeholder form state
        placeholderValueMap: {},
        setPlaceholderValueMap: (map) => set((state) => {
            state.placeholderValueMap = map;
        }),
        updatePlaceholderValue: (key, value) => set((state) => {
            state.placeholderValueMap[key] = value.trim();
        }),
        
        // Computed getters
        hasPlaceholders: () => {
            const state = get();
            return Object.keys(state.placeholderValueMap).length > 0;
        },
        isFormValid: () => {
            const state = get();
            return state.hasPlaceholders() && 
                   Object.values(state.placeholderValueMap).every(v => v.trim() !== "");
        },
        
        // Reset functions
        resetState: () => set((state) => {
            state.currentTab = null;
            state.plainUrl = "";
            state.urlParts = [];
            state.placeholderValueMap = {};
            state.error = null;
            state.isLoading = true;
            state.isHistoryExpanded = false;
        }),
        
        resetError: () => set((state) => {
            state.error = null;
        }),
    }))
);