import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, History, Trash2 } from "lucide-react";
import { useHistoryStore } from "@/pages/popup/PopupStore.ts";

interface HistoryHeaderProps {
    itemCount: number;
    url: string;
}

export const HistoryHeader = ({ itemCount, url }: HistoryHeaderProps) => {
    const isExpanded = useHistoryStore(state => state.isHistoryExpanded);
    const setIsExpanded = useHistoryStore(state => state.setHistoryExpanded);
    const clearHistoryForUrl = useHistoryStore(state => state.clearHistoryForUrl);

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
                <History /> History <Badge variant="secondary">{itemCount} items</Badge>
            </div>

            <div className="flex items-center gap-2">
                {isExpanded && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/20 hover:text-destructive"
                        onClick={() => {
                            if (confirm('Are you sure you want to clear all history for this URL?')) {
                                clearHistoryForUrl(url);
                            }
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded
                        ? <><ChevronDown /> Collapse</>
                        : <><ChevronUp /> Expand</>
                    }
                </Button>
            </div>
        </div>
    );
};