import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toPlaceholderName } from "@/lib/placeholder/placeholderUtil";

interface PlaceholderInputsProps {
    placeholderValueMap: Record<string, string>;
    onPlaceholderChange: (key: string, value: string) => void;
}

export const PlaceholderInputs = ({ placeholderValueMap, onPlaceholderChange }: PlaceholderInputsProps) => {
    const placeholders = Object.keys(placeholderValueMap);

    if (placeholders.length === 0) {
        return (
            <div className="text-center text-sm text-muted-foreground">
                No placeholders found
            </div>
        );
    }

    return (
        <>
            {placeholders.map((placeholder, idx) => (
                <div key={placeholder} className="space-y-1">
                    <Label htmlFor={placeholder}>
                        {toPlaceholderName(placeholder)}
                    </Label>
                    <Input
                        id={placeholder}
                        className="focus-visible:z-10"
                        value={placeholderValueMap[placeholder] || ""}
                        onChange={(e) => onPlaceholderChange(placeholder, e.target.value)}
                        autoFocus={idx === 0}
                        placeholder={`Enter value for ${toPlaceholderName(placeholder)}`}
                    />
                </div>
            ))}
        </>
    );
};