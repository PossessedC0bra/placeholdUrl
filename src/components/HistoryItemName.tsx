import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Pencil, X } from "lucide-react";
import { useHistoryStore } from "@/pages/popup/PopupStore";

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
        if (name.trim() && name !== itemName) {
            updateHistoryItem(url, itemId, name.trim());
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setName(itemName);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleCancel();
        }
    };

    return (
        <>
            {!isEditing ? (
                <div className="flex flex-row items-center justify-between group">
                    <div className="h-7 py-1 font-medium text-sm truncate">{name}</div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="invisible group-hover:visible text-muted-foreground"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsEditing(true);
                        }}
                    >
                        <Pencil />
                    </Button>
                </div>
            ) : (
                <div className="flex flex-row items-center gap-1">
                    <Input
                        className="text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        onBlur={() => {
                            // Auto-save on blur unless user explicitly canceled
                            setTimeout(handleSave, 100);
                        }}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-green-600 hover:bg-green-100 hover:text-green-700"
                        onClick={handleSave}
                    >
                        <Check />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleCancel}
                    >
                        <X />
                    </Button>
                </div>
            )}
        </>
    );
};