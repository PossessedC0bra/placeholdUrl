import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PlaceholderUrlPreviewProps {
    urlParts: [boolean, string][];
    placeholderValueMap: Record<string, string>;
    className?: string;
}

export const PlaceholderUrlPreview = ({ 
    urlParts, 
    placeholderValueMap, 
    className 
}: PlaceholderUrlPreviewProps) => (
    <code className={cn(className, "text-xs text-nowrap leading-relaxed")}>
        {urlParts
            .map(([isPlaceholder, value], idx) => isPlaceholder
                ? <Badge key={idx} variant={placeholderValueMap[value] ? "lightBlue" : "lightRed"}>
                    {placeholderValueMap[value] || value}
                </Badge>
                : <span key={idx}>{value}</span>
            )
        }
    </code>
);