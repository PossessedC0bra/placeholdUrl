import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Pencil, X } from "lucide-react";
import { useHistoryStore } from "@/pages/popup/PopupStore.ts";

interface HistoryItemNameProps {
    itemName: string;
    url: string;
    itemId: string;
}

export const HistoryItemName = ({ itemName, url, itemId }: HistoryItemNameProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(itemName);
    const updateHistoryItem = useHistoryStore(state => state.updateHistoryItem);

    const handleSave = () => {
        if (name.trim() !== itemName) {
            updateHistoryItem(url, itemId, name.trim());
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setName(itemName);
        setIsEditing(false);
    };

    return <>
        {!isEditing
            ? (
                <div className="flex flex-row items-center justify-between group">
                    <div className="h-7 py-1 font-medium text-sm truncate">{name}</div>
                    <Button
                        type="button"
                        variant="ghost"
                        className="invisible group-hover:visible text-muted-foreground"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsEditing(true);
                        }}
                    >
                        <Pencil />
                    </Button>
                </div>
            )
            : (
                <div className="flex flex-row items-center">
                    <Input
                        className="text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSave();
                            } else if (e.key === 'Escape') {
                                handleCancel();
                            }
                        }}
                        autoFocus
                    />
                    <Button
                        variant="ghost"
                        className="text-success hover:bg-success/20 hover:text-success"
                        onClick={handleSave}
                    >
                        <Check />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={handleCancel}
                    >
                        <X />
                    </Button>
                </div>
            )
        }
    </>
};