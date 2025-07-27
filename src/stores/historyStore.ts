import { create } from "zustand";
import type { StateStorage } from "zustand/middleware";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface HistoryItem {
    name: string;
    lastUsed: number;
    usageCount: number;
    placeholders: Record<string, string>;
}

interface HistoryState {
    history: Record<string, Record<string, HistoryItem>>;
    addHistoryItem: (url: string, id: string, item: HistoryItem) => void;
    updateHistoryItem: (url: string, id: string, newName: string) => void;
    removeHistoryItem: (url: string, id: string) => void;
    incrementUsageCount: (url: string, id: string) => void;
    clearHistory: (url?: string) => void;
}

const ChromeExtensionLocalStorage: StateStorage = {
    getItem: async (name) => {
        try {
            const result = await chrome.storage.local.get(name);
            return JSON.stringify(result[name] ?? null);
        } catch (error) {
            console.error("Error getting item from storage:", error);
            return null;
        }
    },
    setItem: async (name, value) => {
        try {
            await chrome.storage.local.set({ [name]: JSON.parse(value) });
        } catch (error) {
            console.error("Error setting item in storage:", error);
        }
    },
    removeItem: async (name) => {
        try {
            await chrome.storage.local.remove(name);
        } catch (error) {
            console.error("Error removing item from storage:", error);
        }
    },
};

export const useHistoryStore = create<HistoryState>()(
    persist(
        immer((set) => ({
            history: {},

            addHistoryItem: (url, id, item) =>
                set((state) => {
                    if (!state.history[url]) {
                        state.history[url] = {};
                    }
                    
                    // Check if item already exists and increment usage count
                    const existingItem = state.history[url][id];
                    if (existingItem) {
                        existingItem.usageCount += 1;
                        existingItem.lastUsed = Date.now();
                        existingItem.placeholders = { ...item.placeholders };
                    } else {
                        state.history[url][id] = { ...item };
                    }
                }),

            updateHistoryItem: (url, id, newName) =>
                set((state) => {
                    const item = state.history[url]?.[id];
                    if (item) {
                        item.name = newName;
                    }
                }),

            removeHistoryItem: (url, id) =>
                set((state) => {
                    if (state.history[url]) {
                        delete state.history[url][id];
                        
                        // Clean up empty URL entries
                        if (Object.keys(state.history[url]).length === 0) {
                            delete state.history[url];
                        }
                    }
                }),

            incrementUsageCount: (url, id) =>
                set((state) => {
                    const item = state.history[url]?.[id];
                    if (item) {
                        item.usageCount += 1;
                        item.lastUsed = Date.now();
                    }
                }),

            clearHistory: (url) =>
                set((state) => {
                    if (url) {
                        delete state.history[url];
                    } else {
                        state.history = {};
                    }
                }),
        })),
        {
            name: "placeholdurl-history",
            storage: createJSONStorage(() => ChromeExtensionLocalStorage),
            version: 1,
        }
    )
);