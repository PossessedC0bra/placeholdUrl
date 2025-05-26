import {GLOBAL_PLACEHOLDER_REGEX} from "@/lib/placeholder/placeholderUtil.ts";

chrome.tabs.onUpdated.addListener(async (_tabId, changeInfo, tab) => {
    if (changeInfo.status !== "loading" || !tab?.url) return;

    const plainUrl = decodeURIComponent(tab.url);
    const matches = plainUrl.match(GLOBAL_PLACEHOLDER_REGEX);
    if (matches && matches.length > 0) {
        await chrome.action.openPopup();
    }
});
