import type {BrowserStorageApi, BrowserTabApi} from "@/lib/browser/BrowserTabApi";

export const ChromeExtensionTabApi: BrowserTabApi = {
    init: () => ChromeExtensionTabApi,
    queryTabs: async (query) => chrome.tabs.query(query),
    updateTab: async (tabId, props) => chrome.tabs.update(tabId, props),
};

const CHROME_STORAGE_BACKEND = () => chrome.storage.local;

export const ChromeExtensionStorageApi: BrowserStorageApi = {
    init: () => ChromeExtensionStorageApi,
    get: async (keys?: string | string[] | object): Promise<object> => {
        try {
            if (keys === undefined) {
                return await CHROME_STORAGE_BACKEND().get();
            } else if (typeof keys === 'string') {
                return await CHROME_STORAGE_BACKEND().get([keys]);
            } else if (Array.isArray(keys)) {
                return await CHROME_STORAGE_BACKEND().get(keys);
            } else {
                return await CHROME_STORAGE_BACKEND().get(keys);
            }
        } catch (error) {
            console.error('ChromeExtensionStorageApi.get error:', error);
            throw error;
        }
    },
    set: async (items: object): Promise<void> => {
        try {
            return await CHROME_STORAGE_BACKEND().set(items);
        } catch (error) {
            console.error('ChromeExtensionStorageApi.set error:', error);
            throw error;
        }
    }
};
