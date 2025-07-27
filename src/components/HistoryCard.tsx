import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card.tsx";
import { X } from "lucide-react";
import { type HistoryItem } from "@/pages/popup/PopupStore.ts";
import { PlaceholderUrlPreview } from "./PlaceholderUrlPreview.tsx";
import { HistoryItemName } from "./HistoryItemName.tsx";

interface HistoryCardProps {
    urlParts: [boolean, string][];
    item: HistoryItem;
    url: string;
    itemId: string;
    onRemove: (item: HistoryItem) => void;
}

export const HistoryCard = ({ urlParts, item, url, itemId, onRemove }: HistoryCardProps) => (
    <Card className="p-4 gap-2 flex flex-row snap-center group">
        <CardContent className="overflow-x-hidden px-0 space-y-1">
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
        </CardContent>
        <CardFooter className="px-0">
            <Button
                type="button"
                variant="ghost"
                className="text-destructive hover:bg-destructive/20 hover:text-destructive"
                onClick={() => onRemove(item)}
            >
                <X />
            </Button>
        </CardFooter>
    </Card>
);