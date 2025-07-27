import { useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toPlaceholderName } from "@/lib/placeholder/placeholderUtil";

interface PlaceholderFormProps {
    placeholderValueMap: Record<string, string>;
    onPlaceholderChange: (key: string, value: string) => void;
    onSubmit?: () => void;
}

export const PlaceholderForm = ({ 
    placeholderValueMap, 
    onPlaceholderChange,
    onSubmit 
}: PlaceholderFormProps) => {
    const placeholderKeys = Object.keys(placeholderValueMap);
    const firstInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Focus the first input when component mounts
        if (firstInputRef.current && placeholderKeys.length > 0) {
            firstInputRef.current.focus();
        }
    }, [placeholderKeys.length]);

    const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            
            // Move to next input or submit if on last input
            const nextIndex = currentIndex + 1;
            if (nextIndex < placeholderKeys.length) {
                const nextInput = document.getElementById(placeholderKeys[nextIndex]) as HTMLInputElement;
                nextInput?.focus();
            } else {
                onSubmit?.();
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = Math.min(currentIndex + 1, placeholderKeys.length - 1);
            const nextInput = document.getElementById(placeholderKeys[nextIndex]) as HTMLInputElement;
            nextInput?.focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = Math.max(currentIndex - 1, 0);
            const prevInput = document.getElementById(placeholderKeys[prevIndex]) as HTMLInputElement;
            prevInput?.focus();
        }
    };

    if (placeholderKeys.length === 0) {
        return (
            <div className="text-center text-sm text-muted-foreground py-8">
                <div className="mb-2">🔗</div>
                <div>No placeholders found in this URL</div>
                <div className="text-xs mt-1">Placeholders should be in format: {'{{placeholder}}'}</div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {placeholderKeys.map((placeholder, idx) => (
                <div key={placeholder} className="space-y-1">
                    <Label 
                        htmlFor={placeholder}
                        className="text-sm font-medium"
                    >
                        {toPlaceholderName(placeholder)}
                    </Label>
                    <Input
                        ref={idx === 0 ? firstInputRef : undefined}
                        id={placeholder}
                        className="focus-visible:z-10"
                        value={placeholderValueMap[placeholder] || ""}
                        onChange={(e) => onPlaceholderChange(placeholder, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        placeholder={`Enter value for ${toPlaceholderName(placeholder)}`}
                        autoComplete="off"
                    />
                </div>
            ))}
            <div className="text-xs text-muted-foreground pt-2">
                💡 Use ↑/↓ arrows to navigate, Enter to go to next field or submit
            </div>
        </div>
    );
};