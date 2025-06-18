export interface BrowserTab {
    id?: number;
    url?: string;
}

export interface BrowserTabApi {
    init(): BrowserTabApi

    queryTabs(query: { active: boolean; currentWindow: boolean }): Promise<BrowserTab[]>;

    updateTab(tabId: number, props: { url: string }): Promise<BrowserTab | undefined>;
}

export interface BrowserStorageApi {
    init(): BrowserStorageApi

    get(keys?: string | string[] | object): Promise<object>;

    set(items: object): Promise<void>;
}
