import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, History } from "lucide-react";
import { useHistoryStore } from "@/pages/popup/PopupStore";

interface HistoryHeaderProps {
    itemCount: number;
}

export const HistoryHeader = ({ itemCount }: HistoryHeaderProps) => {
    const isExpanded = useHistoryStore(state => state.isHistoryExpanded);
    const setIsExpanded = useHistoryStore(state => state.setHistoryExpanded);

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
                <History /> History <Badge variant="secondary">{itemCount} items</Badge>
            </div>

            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isExpanded
                    ? <><ChevronDown /> Collapse</>
                    : <><ChevronUp /> Expand</>
                }
            </Button>
        </div>
    );
};