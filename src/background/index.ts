import {GLOBAL_PLACEHOLDER_REGEX} from "@/lib/placeholder/placeholderUtil.ts";

function openPopupOnPlaceholderDetection(tab: chrome.tabs.Tab) {
    if (!tab.url) {
        return;
    }

    const plainUrl = decodeURIComponent(tab.url);
    const matches = plainUrl.match(GLOBAL_PLACEHOLDER_REGEX);
    if (matches && matches.length > 0) {
        chrome.action.openPopup().catch(console.log);
    }
}

chrome.tabs.onActivated.addListener(async ({tabId}) => {
    const tab = await chrome.tabs.get(tabId);
    openPopupOnPlaceholderDetection(tab);
});

chrome.tabs.onUpdated.addListener(async (_tabId, _changeInfo, tab) => {
    if (!tab.active) {
        return;
    }

    openPopupOnPlaceholderDetection(tab);
});
