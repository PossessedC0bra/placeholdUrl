import { create } from "zustand";
import type { StateStorage } from "zustand/middleware";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === "development";

export interface HistoryItem {
    name: string;
    lastUsed: number;
    usageCount: number;
    placeholders: Record<string, string>;
}

interface HistoryState {
    isHistoryExpanded: boolean;
    setHistoryExpanded: (expanded: boolean) => void;

    history: Record<string, Record<string, HistoryItem>>;
    addHistoryItem: (url: string, id: string, item: HistoryItem) => void;
    updateHistoryItem: (url: string, id: string, newName: string) => void;
    removeHistoryItem: (url: string, id: string) => void;
}

const ChromeExtensionLocalStorage: StateStorage = {
    getItem: async (name) => {
        const result = await chrome.storage.local.get(name);
        return JSON.stringify(result[name] ?? null);
    },
    setItem: async (name, value) => {
        await chrome.storage.local.set({ [name]: JSON.parse(value) });
    },
    removeItem: async (name) => {
        await chrome.storage.local.remove(name);
    },
};

export const useHistoryStore = create<HistoryState>()(
    persist(
        immer((set) => ({
            isHistoryExpanded: false,
            history: {},

            setHistoryExpanded: (expanded) => set((state) => {
                state.isHistoryExpanded = expanded;
            }),

            addHistoryItem: (url, id, item) =>
                set((state) => {
                    if (!state.history[url]) {
                        state.history[url] = {};
                    }
                    
                    state.history[url][id] = item;
                }),

            updateHistoryItem: (url, id, newName) =>
                set((state) => {
                    const item = state.history[url][id];
                    if (item) {
                        item.name = newName;
                    }
                }),

            removeHistoryItem: (url, id) =>
                set((state) => {
                    delete state.history[url][id];
                }),
        })),
        {
            name: "placeholdurl-history",
            storage: createJSONStorage(() => ChromeExtensionLocalStorage),
            version: 1,
        }
    )
);
