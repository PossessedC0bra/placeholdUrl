import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Replace } from "lucide-react";
import { GLOBAL_PLACEHOLDER_REGEX } from "@/lib/placeholder/placeholderUtil";
import { useHistoryStore, usePopupStore, type HistoryItem } from "@/stores";
import { useAutoAnimateWithDisabledSupport } from "@/hooks/useAutoAnimateWithDisabledSupport";
import { PlaceholderUrlPreview } from "@/components/PlaceholderUrlPreview";
import { HistoryView } from "@/components/HistoryView";
import { PlaceholderForm } from "@/components/PlaceholderForm";

function Popup() {
    // Popup state (non-persisted)
    const {
        isLoading,
        setIsLoading,
        error,
        setError,
        currentTab,
        setCurrentTab,
        plainUrl,
        setPlainUrl,
        urlParts,
        setUrlParts,
        placeholderValueMap,
        setPlaceholderValueMap,
        updatePlaceholderValue,
        isHistoryExpanded,
        setHistoryExpanded,
        isFormValid,
        resetError
    } = usePopupStore();

    // History state (persisted)
    const { addHistoryItem } = useHistoryStore();

    const [parent] = useAutoAnimateWithDisabledSupport();

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                resetError();
                
                const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
                
                if (!activeTab || !activeTab.url) {
                    setError("No active tab with a valid URL found.");
                    return;
                }

                setCurrentTab(activeTab);
                const decodedUrl = decodeURIComponent(activeTab.url);
                setPlainUrl(decodedUrl);

                const urlParts = decodedUrl
                    .split(GLOBAL_PLACEHOLDER_REGEX)
                    .map(part => [GLOBAL_PLACEHOLDER_REGEX.test(part), part] as [boolean, string]);
                setUrlParts(urlParts);

                const placeholderMap = urlParts
                    .filter(([isPlaceholder]) => isPlaceholder)
                    .reduce(
                        (map, [, placeholder]) => {
                            map[placeholder] = '';
                            return map;
                        },
                        {} as Record<string, string>
                    );
                setPlaceholderValueMap(placeholderMap);
            } catch (err) {
                setError("Failed to load tab information.");
                console.error("Error loading tab:", err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [setIsLoading, setError, setCurrentTab, setPlainUrl, setUrlParts, setPlaceholderValueMap, resetError]);

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

    const handleUseHistoryItem = (placeholders: Record<string, string>) => {
        setPlaceholderValueMap(placeholders);
        setHistoryExpanded(false);
    };

    const handleSubmit = async () => {
        if (!currentTab?.id || !plainUrl || !isFormValid()) return;

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

            await chrome.tabs.update(currentTab.id, { url: resolvedUrl });
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
                            onPlaceholderChange={updatePlaceholderValue}
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
                    disabled={!isFormValid()}
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
