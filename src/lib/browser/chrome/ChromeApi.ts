import type {BrowserStorageApi, BrowserTabApi} from "@/lib/browser/BrowserTabApi.ts";

export const ChromeExtensionTabApi: BrowserTabApi = {
    init: () => ChromeExtensionTabApi,
    queryTabs: async (query) => chrome.tabs.query(query),
    updateTab: async (tabId, props) => chrome.tabs.update(tabId, props),
};

const CHROME_STORAGE_BACKEND = () => chrome.storage.local;
export const ChromeExtensionStorageApi: BrowserStorageApi = {
    init: () => ChromeExtensionStorageApi,
    get: async (keys?: string | string[] | object): Promise<object> => {
        console.log('ChromeExtensionStorageApi.get', keys);
        // @ts-ignore
        return CHROME_STORAGE_BACKEND().get(keys)
    },
    set: async (items: object): Promise<void> => {
        console.log('ChromeExtensionStorageApi.set', items);
        return CHROME_STORAGE_BACKEND().set(items)
    }
};
