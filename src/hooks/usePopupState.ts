import { useEffect, useState } from "react";
import { processUrl, resolveUrl } from "@/lib/url/urlProcessor";
import { useHistoryStore, type HistoryItem } from "@/pages/popup/PopupStore";

export const usePopupState = () => {
    const [tab, setTab] = useState<chrome.tabs.Tab | null>(null);
    const [plainUrl, setPlainUrl] = useState("");
    const [urlParts, setUrlParts] = useState<[boolean, string][]>([]);
    const [placeholderValueMap, setPlaceholderValueMap] = useState({} as Record<string, string>);

    const addHistoryItem = useHistoryStore(state => state.addHistoryItem);

    useEffect(() => {
        const initializePopup = async () => {
            try {
                const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (!activeTab || !activeTab.url) {
                    console.error("No active tab with a valid URL found.");
                    return;
                }

                setTab(activeTab);

                const decodedUrl = decodeURIComponent(activeTab.url);
                setPlainUrl(decodedUrl);

                const { parts, placeholderValueMap } = processUrl(decodedUrl);
                setUrlParts(parts);
                setPlaceholderValueMap(placeholderValueMap);
            } catch (error) {
                console.error("Error initializing popup:", error);
            }
        };

        initializePopup();
    }, []);

    const handlePlaceholderChange = (key: string, value: string) => {
        setPlaceholderValueMap(prev => ({
            ...prev,
            [key]: value.trim()
        }));
    };

    const handleReplace = async () => {
        if (!tab?.id) {
            console.error("No active tab found");
            return;
        }

        const resolvedUrl = resolveUrl(plainUrl, placeholderValueMap);

        // Save to history
        const historyItem: HistoryItem = {
            name: resolvedUrl,
            placeholders: placeholderValueMap,
            lastUsed: Date.now(),
            usageCount: 1
        };
        addHistoryItem(plainUrl, resolvedUrl, historyItem);

        await chrome.tabs.update(tab.id, { url: resolvedUrl });
        window.close(); // Close the popup after replacing
    };

    const hasValidPlaceholders = Object.keys(placeholderValueMap).length > 0;
    const hasAllValues = Object.values(placeholderValueMap).every(v => v.trim() !== "");
    const canSubmit = hasValidPlaceholders && hasAllValues;

    return {
        tab,
        plainUrl,
        urlParts,
        placeholderValueMap,
        handlePlaceholderChange,
        handleReplace,
        hasValidPlaceholders,
        hasAllValues,
        canSubmit
    };
};