import { create } from "zustand";
import type { StateStorage } from "zustand/middleware";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === "development";

export interface HistoryItem {
    id: number;
    name: string;
    lastUsed?: number;
    usageCount?: number;
    placeholders: Record<string, string>;
}

interface HistoryState {
    isHistoryExpanded: boolean;
    setHistoryExpanded: (expanded: boolean) => void;

    history: Record<string, HistoryItem[]>;
    addHistoryItem: (url: string, item: HistoryItem) => void; // Optional for future use
    updateHistoryItem: (url: string, id: number, newName: string) => void;
    removeHistoryItem: (url: string, id: number) => void;
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
            history: {
                "https://{{bucketname}}.s3.{{awsregion}}.amazonaws.com/{{key}}": [
                    {
                        id: 1,
                        name: "Example S3 URL",
                        lastUsed: Date.now(),
                        usageCount: 5,
                        placeholders: {
                            '{{bucketname}}': "my-bucket",
                            '{{awsregion}}': "us-west-2",
                            '{{key}}': "path/to/object",
                        },
                    },
                    {
                        id: 2,
                        name: "Another Example",
                        lastUsed: Date.now() - 100000,
                        usageCount: 3,
                        placeholders: {
                            '{{bucketname}}': "another-bucket",
                            '{{awsregion}}': "us-east-1",
                            '{{key}}': "another/path/to/object",
                        },
                    },
                ]
            },

            setHistoryExpanded: (expanded) => set((state) => {
                state.isHistoryExpanded = expanded;
            }),

            addHistoryItem: (url, item) =>
                set((state) => {
                    if (!state.history[url]) {
                        state.history[url] = [];
                    }
                    state.history[url].push(item);
                }),

            updateHistoryItem: (url, id, newName) =>
                set((state) => {
                    const item = state.history[url]?.find((item) => item.id === id);
                    if (item) item.name = newName;
                }),

            removeHistoryItem: (url, id) =>
                set((state) => {
                    const list = state.history[url] ?? [];
                    state.history[url] = list.filter((item) => item.id !== id);
                }),
        })),
        {
            name: "placeholdurl-history",
            storage: createJSONStorage(() => ChromeExtensionLocalStorage),
            version: 1,
        }
    )
);
