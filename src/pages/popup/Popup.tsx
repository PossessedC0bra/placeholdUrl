import {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ExternalLink, Replace} from "lucide-react";
import {GLOBAL_PLACEHOLDER_REGEX, toPlaceholderName} from "@/lib/placeholder/placeholderUtil";
import {Label} from "@/components/ui/label";

function extractPlaceholders(url: string): Record<string, string> {
    return Array.from(url.matchAll(GLOBAL_PLACEHOLDER_REGEX))
        .map(match => match[0])
        .filter(Boolean)
        .reduce(
            (placeholderValueMap, placeholderName) => {
                placeholderValueMap[placeholderName!] = "";
                return placeholderValueMap;
            },
            {} as Record<string, string>
        )
}

function Popup() {
    const [tab, setTab] = useState<chrome.tabs.Tab | null>(null);
    const [plainUrl, setPlainUrl] = useState("");
    const [urlParts, setUrlParts] = useState<string[]>([]);
    const [placeholderValueMap, setPlaceholderValueMap] = useState({} as Record<string, string>);

    useEffect(() => {
        (async () => {
            const [activeTab] = await chrome.tabs.query({active: true, currentWindow: true});
            if (!activeTab || !activeTab.url) {
                console.error("No active tab with a valid URL found.");
                return;
            }

            setTab(activeTab);

            const plainUrl = decodeURIComponent(activeTab.url!);
            setPlainUrl(plainUrl);
            setUrlParts(plainUrl.split(GLOBAL_PLACEHOLDER_REGEX));
            setPlaceholderValueMap(extractPlaceholders(plainUrl));
        })();
    }, []);

    const handlePlaceholderChange = (key: string, value: string) => setPlaceholderValueMap({
        ...placeholderValueMap,
        [key]: value.trim()
    });

    const handleReplace = async () => {
        let resolvedUrl = plainUrl;
        for (const [placeholder, val] of Object.entries(placeholderValueMap)) {
            resolvedUrl = resolvedUrl.replace(
                new RegExp(placeholder, 'g'),
                encodeURIComponent(val)
            );
        }

        await chrome.tabs.update(tab!.id!, {url: resolvedUrl});
        window.close(); // Close the popup after replacing
    };

    return (
        <form onSubmit={handleReplace} className="w-[500px] max-h-[600px] py-3 flex flex-col gap-4">
            {/* Header */}
            <div className="mx-3 flex items-center gap-2">
                <Replace/>
                <span className="text-2xl font-bold">PlaceholdURL</span>
            </div>

            {/* URL Preview */}
            <code className="bg-muted mx-3 p-3 overflow-x-auto rounded-md text-xs text-nowrap leading-relaxed">
                {urlParts
                    .map((part, index) => {
                        const match = part.match(GLOBAL_PLACEHOLDER_REGEX);
                        if (!match) {
                            return <span key={index}>{part}</span>;
                        }

                        return <Badge
                            key={index}
                            variant={placeholderValueMap[part] ? "lightBlue" : "lightRed"}
                        >
                            {placeholderValueMap[part] || part}
                        </Badge>

                    })}
            </code>

            {/* Placeholder Fields */}
            <div className="px-3 pb-1 overflow-y-auto space-y-2">
                {Object.keys(placeholderValueMap).length === 0
                    ? (
                        <div className="flex justify-center text-sm text-muted-foreground">
                            No placeholders
                            found
                        </div>
                    )
                    : (
                        Object.keys(placeholderValueMap)
                            .map((placeholder, idx) => (
                                <div key={placeholder} className="space-y-1">
                                    <Label htmlFor={placeholder}>
                                        {toPlaceholderName(placeholder)}
                                    </Label>
                                    <Input
                                        id={placeholder}
                                        value={placeholderValueMap[placeholder] || ""}
                                        onChange={(e) => handlePlaceholderChange(placeholder, e.target.value)}
                                        autoFocus={idx === 0}
                                    />
                                </div>
                            ))
                    )
                }
            </div>

            {/* Replace Button */}
            <Button
                type="submit"
                disabled={Object.keys(placeholderValueMap).length === 0 || Object.values(placeholderValueMap).some(v => v.trim() === "")}
                className="mx-3"
            >
                <ExternalLink/>
                Open
            </Button>
        </form>
    );
}

export default Popup;
