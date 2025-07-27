import { useState } from "react";
import { Search } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { InputWithAdornments } from "@/components/InputWithAdornments";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHistoryStore } from "@/stores/historyStore";
import { usePopupStore } from "@/stores/popupStore";
import { HistoryHeader } from "@/components/HistoryHeader";
import { HistoryCard } from "@/components/HistoryCard";

interface HistoryViewProps {
    url: string;
    urlParts: [boolean, string][];
    onUseHistoryItem?: (placeholders: Record<string, string>) => void;
}

type SortOption = 'lastUsed' | 'usageCount' | 'name';

export const HistoryView = ({ url, urlParts, onUseHistoryItem }: HistoryViewProps) => {
    // Get history state from history store
    const {
        history: historyStore,
        removeHistoryItem,
        incrementUsageCount
    } = useHistoryStore();
    
    // Get UI state from popup store
    const {
        isHistoryExpanded,
        setHistoryExpanded
    } = usePopupStore();
    
    const history = historyStore[url] || {};
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('lastUsed');

    const [historyView] = useAutoAnimate();
    const [historyList] = useAutoAnimate();

    const numberOfItems = Object.keys(history).length;

    // Filter and sort history items
    const filteredAndSortedHistory = Object.entries(history)
        .filter(([, item]) => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            Object.values(item.placeholders).some(value => 
                value.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
        .sort(([, a], [, b]) => {
            switch (sortBy) {
                case 'lastUsed':
                    return b.lastUsed - a.lastUsed;
                case 'usageCount':
                    return b.usageCount - a.usageCount;
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

    const handleUseHistoryItem = (id: string, placeholders: Record<string, string>) => {
        incrementUsageCount(url, id);
        onUseHistoryItem?.(placeholders);
        setHistoryExpanded(false);
    };

    if (numberOfItems === 0) {
        return null;
    }

    return (
        <div
            ref={historyView}
            className={`${!isHistoryExpanded ? "flex-none" : "flex-1"} px-4 overflow-y-hidden flex flex-col gap-2`}
        >
            <HistoryHeader itemCount={numberOfItems} />

            {isHistoryExpanded && (
                <div className="flex items-center gap-2">
                    <InputWithAdornments
                        startAdornment={<Search />}
                        placeholder="Search history..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="lastUsed">Last Used</SelectItem>
                            <SelectItem value="usageCount">Usage Count</SelectItem>
                            <SelectItem value="name">Name</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div
                ref={historyList}
                className={`${!isHistoryExpanded ? "flex-none max-h-[120px] snap-y snap-mandatory" : "flex-auto"} overflow-y-auto flex flex-col gap-2`}
            >
                {filteredAndSortedHistory.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-4">
                        {searchQuery ? "No history items match your search" : "No history items found"}
                    </div>
                ) : (
                    filteredAndSortedHistory.map(([id, item]) => (
                        <HistoryCard
                            key={id}
                            urlParts={urlParts}
                            item={item}
                            url={url}
                            itemId={id}
                            onRemove={() => {
                                removeHistoryItem(url, id);
                                setHistoryExpanded(isHistoryExpanded && numberOfItems > 1);
                            }}
                            onUse={onUseHistoryItem ? (placeholders) => handleUseHistoryItem(id, placeholders) : undefined}
                        />
                    ))
                )}
            </div>
        </div>
    );
};