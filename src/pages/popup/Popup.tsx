import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Replace } from "lucide-react";
import { GLOBAL_PLACEHOLDER_REGEX } from "@/lib/placeholder/placeholderUtil";
import { useHistoryStore, type HistoryItem } from "@/pages/popup/PopupStore";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { PlaceholderUrlPreview } from "@/components/PlaceholderUrlPreview";
import { HistoryView } from "@/components/HistoryView";
import { PlaceholderForm } from "@/components/PlaceholderForm";

function Popup() {
    const [tab, setTab] = useState<chrome.tabs.Tab | null>(null);
    const [plainUrl, setPlainUrl] = useState("");
    const [urlParts, setUrlParts] = useState<[boolean, string][]>([]);
    const [placeholderValueMap, setPlaceholderValueMap] = useState({} as Record<string, string>);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const addHistoryItem = useHistoryStore(state => state.addHistoryItem);
    const isHistoryExpanded = useHistoryStore(state => state.isHistoryExpanded);
    const setHistoryExpanded = useHistoryStore(state => state.setHistoryExpanded);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
                
                if (!activeTab || !activeTab.url) {
                    setError("No active tab with a valid URL found.");
                    return;
                }

                setTab(activeTab);
                const plainUrl = decodeURIComponent(activeTab.url);
                setPlainUrl(plainUrl);

                const urlParts = plainUrl
                    .split(GLOBAL_PLACEHOLDER_REGEX)
                    .map(part => [GLOBAL_PLACEHOLDER_REGEX.test(part), part] as [boolean, string]);
                setUrlParts(urlParts);

                setPlaceholderValueMap(urlParts
                    .filter(([isPlaceholder]) => isPlaceholder)
                    .reduce(
                        (map, [, placeholder]) => {
                            map[placeholder] = '';
                            return map;
                        },
                        {} as Record<string, string>
                    ));
            } catch (err) {
                setError("Failed to load tab information.");
                console.error("Error loading tab:", err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    // Global keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Escape to close popup or collapse history
            if (e.key === 'Escape') {
                if (isHistoryExpanded) {
                    setHistoryExpanded(false);
                } else {
                    window.close();
                }
            }
            // Ctrl/Cmd + H to toggle history
            else if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
                e.preventDefault();
                setHistoryExpanded(!isHistoryExpanded);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isHistoryExpanded, setHistoryExpanded]);

    const handlePlaceholderChange = (key: string, value: string) => 
        setPlaceholderValueMap(prev => ({
            ...prev,
            [key]: value.trim()
        }));

    const handleUseHistoryItem = (placeholders: Record<string, string>) => {
        setPlaceholderValueMap(placeholders);
        setHistoryExpanded(false);
    };

    const handleSubmit = async () => {
        if (!tab?.id || !plainUrl || !isFormValid) return;

        try {
            let resolvedUrl = plainUrl;
            for (const [placeholder, val] of Object.entries(placeholderValueMap)) {
                resolvedUrl = resolvedUrl.replace(
                    new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                    encodeURIComponent(val)
                );
            }

            // Save to history
            const historyItem: HistoryItem = {
                name: resolvedUrl,
                placeholders: { ...placeholderValueMap },
                lastUsed: Date.now(),
                usageCount: 1
            };
            addHistoryItem(plainUrl, resolvedUrl, historyItem);

            await chrome.tabs.update(tab.id, { url: resolvedUrl });
            window.close();
        } catch (err) {
            setError("Failed to navigate to URL.");
            console.error("Error updating tab:", err);
        }
    };

    const handleReplace = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSubmit();
    };

    const [parent] = useAutoAnimate();
    
    const hasPlaceholders = Object.keys(placeholderValueMap).length > 0;
    const isFormValid = hasPlaceholders && Object.values(placeholderValueMap).every(v => v.trim() !== "");

    if (isLoading) {
        return (
            <div className="w-[500px] h-[200px] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-[500px] h-[200px] flex items-center justify-center">
                <div className="text-center space-y-2">
                    <p className="text-sm text-destructive">{error}</p>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.close()}
                    >
                        Close
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <form
            ref={parent}
            onSubmit={handleReplace}
            className="w-[500px] max-h-[600px] py-3 flex flex-col gap-4"
        >
            {/* Header */}
            <div className="mx-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Replace />
                    <span className="text-2xl font-bold">PlaceholdURL</span>
                </div>
                <div className="text-xs text-muted-foreground">
                    Press Esc to close • Ctrl+H for history
                </div>
            </div>

            {!isHistoryExpanded && (
                <>
                    <div
                        key="urlPreview"
                        className="flex-none mx-4 p-2 bg-muted rounded-md border overflow-x-auto"
                    >
                        <PlaceholderUrlPreview 
                            urlParts={urlParts} 
                            placeholderValueMap={placeholderValueMap} 
                        />
                    </div>

                    <div
                        key="placeholders"
                        className="flex-1 px-4 overflow-y-auto flex flex-col [&>*:last-child]:pb-1"
                    >
                        <PlaceholderForm
                            placeholderValueMap={placeholderValueMap}
                            onPlaceholderChange={handlePlaceholderChange}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </>
            )}

            {/* History View */}
            <HistoryView 
                url={plainUrl} 
                urlParts={urlParts} 
                onUseHistoryItem={handleUseHistoryItem}
            />

            {/* Replace Button */}
            {!isHistoryExpanded && (
                <Button
                    type="submit"
                    disabled={!isFormValid}
                    className="mx-3"
                >
                    <ExternalLink />
                    Open URL
                </Button>
            )}
        </form>
    );
}

export default Popup;
