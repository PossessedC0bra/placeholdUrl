import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Search } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useHistoryStore } from "@/pages/popup/PopupStore.ts";
import { InputWithAdornments } from "./InputWithAdornments.tsx";
import { HistoryHeader } from "./HistoryHeader.tsx";
import { HistoryCard } from "./HistoryCard.tsx";

interface HistoryViewProps {
    url: string;
    urlParts: [boolean, string][];
}

export const HistoryView = ({ url, urlParts }: HistoryViewProps) => {
    const isExpanded = useHistoryStore(state => state.isHistoryExpanded);
    const historyStore = useHistoryStore(state => state.history);
    const removeHistoryItem = useHistoryStore(state => state.removeHistoryItem);
    const setIsExpanded = useHistoryStore(state => state.setHistoryExpanded);

    const history = historyStore[url] || [];
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'lastUsed' | 'usageCount'>('lastUsed');

    const [historyView] = useAutoAnimate();
    const [historyList] = useAutoAnimate();

    const numberOfItems = Object.values(history).length;

    if (numberOfItems === 0) {
        return null;
    }

    return (
        <div
            ref={historyView}
            className={`${!isExpanded ? "flex-none" : "flex-1"} px-4 overflow-y-hidden flex flex-col gap-2`}
        >
            <HistoryHeader itemCount={numberOfItems} url={url} />

            {isExpanded && (
                <div className="flex items-center gap-2">
                    <InputWithAdornments
                        startAdornment={<Search />}
                        placeholder={'Search...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Select value={sortBy} onValueChange={(value: 'lastUsed' | 'usageCount') => setSortBy(value)}>
                        <SelectTrigger className="">
                            <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="lastUsed">Last Used</SelectItem>
                            <SelectItem value="usageCount">Usage Count</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div
                ref={historyList}
                className={`${!isExpanded ? "flex-none max-h-[120px] snap-y snap-mandatory" : "flex-auto"} overflow-y-auto flex flex-col gap-2`}
            >
                {Object.entries(history)
                    .filter(([, h]) => h.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .sort(([, a], [, b]) => {
                        if (sortBy === 'lastUsed') {
                            return b.lastUsed - a.lastUsed;
                        } else {
                            return b.usageCount - a.usageCount;
                        }
                    })
                    .map(([id, item]) => (
                        <HistoryCard
                            key={id}
                            urlParts={urlParts}
                            item={item}
                            url={url}
                            itemId={id}
                            onRemove={() => {
                                removeHistoryItem(url, id);
                                setIsExpanded(isExpanded && numberOfItems > 1);
                            }}
                        />
                    ))}
            </div>
        </div>
    );
};