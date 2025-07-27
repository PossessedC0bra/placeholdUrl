import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { X, ArrowUpRight } from "lucide-react";
import type { HistoryItem } from "@/pages/popup/PopupStore";
import { PlaceholderUrlPreview } from "@/components/PlaceholderUrlPreview";
import { HistoryItemName } from "@/components/HistoryItemName";

interface HistoryCardProps {
    urlParts: [boolean, string][];
    item: HistoryItem;
    url: string;
    itemId: string;
    onRemove: () => void;
    onUse?: (placeholders: Record<string, string>) => void;
}

export const HistoryCard = ({ 
    urlParts, 
    item, 
    url, 
    itemId, 
    onRemove,
    onUse 
}: HistoryCardProps) => (
    <Card 
        className={`p-4 gap-2 flex flex-row snap-center group transition-colors ${
            onUse ? 'cursor-pointer hover:bg-muted/50' : ''
        }`}
        onClick={() => onUse?.(item.placeholders)}
    >
        <CardContent className="overflow-x-hidden px-0 space-y-1 flex-1">
            <HistoryItemName 
                itemName={item.name} 
                url={url} 
                itemId={itemId} 
            />
            <PlaceholderUrlPreview
                urlParts={urlParts}
                placeholderValueMap={item.placeholders}
                className="overflow-x-auto text-muted-foreground"
            />
            <div className="text-xs text-muted-foreground">
                Used {item.usageCount} time{item.usageCount !== 1 ? 's' : ''} • 
                Last used {new Date(item.lastUsed).toLocaleDateString()}
            </div>
        </CardContent>
        <CardFooter className="px-0 flex-col gap-1">
            {onUse && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:bg-primary/20 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                        e.stopPropagation();
                        onUse(item.placeholders);
                    }}
                >
                    <ArrowUpRight />
                </Button>
            )}
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/20 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
            >
                <X />
            </Button>
        </CardFooter>
    </Card>
);