import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, History } from "lucide-react";
import { usePopupStore } from "@/stores/popupStore";

interface HistoryHeaderProps {
    itemCount: number;
}

export const HistoryHeader = ({ itemCount }: HistoryHeaderProps) => {
    const { isHistoryExpanded, setHistoryExpanded } = usePopupStore();

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
                <History /> History <Badge variant="secondary">{itemCount} items</Badge>
            </div>

            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setHistoryExpanded(!isHistoryExpanded)}
            >
                {isHistoryExpanded
                    ? <><ChevronDown /> Collapse</>
                    : <><ChevronUp /> Expand</>
                }
            </Button>
        </div>
    );
};