import {useEffect, useState} from "react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ExternalLink, Replace} from "lucide-react";
import {GLOBAL_PLACEHOLDER_REGEX, toPlaceholderName} from "@/lib/placeholder/placeholderUtil";
import {Label} from "@radix-ui/react-label";

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
    useEffect(() => {
        (async () => {
            const [activeTab] = await chrome.tabs.query({active: true, currentWindow: true});
            setTab(activeTab);
        })();
    }, []);

    const [plainUrl, setPlainUrl] = useState("");
    const [urlParts, setUrlParts] = useState<string[]>([]);
    const [placeholderValueMap, setPlaceholderValueMap] = useState({} as Record<string, string>);
    useEffect(() => {
        if (!tab) {
            return;
        }

        const plainUrl = decodeURIComponent(tab.url!);
        setPlainUrl(plainUrl);
        console.log(`Plain URL: ${plainUrl}`);

        const urlParts = plainUrl.split(GLOBAL_PLACEHOLDER_REGEX);
        setUrlParts(urlParts);
        console.log(`URL Parts: `, urlParts);

        const placeholderValueMap = extractPlaceholders(plainUrl);
        setPlaceholderValueMap(extractPlaceholders(plainUrl));
        console.log(`Placeholder Value Map: `, placeholderValueMap);
    }, [tab]);

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
        <form onSubmit={handleReplace} className="m-4 space-y-4">
            <div className="flex gap-2">
                <Replace/>
                <span className="text-2xl font-bold">PlaceholdURL</span>
            </div>

            <div>
                <div className="text-sm font-medium mb-2">URL Preview</div>

                <div className="bg-muted p-3 rounded-md border max-h-20 overflow-x-auto">
                    <code className="text-xs text-nowrap leading-relaxed">
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
                </div>
            </div>

            {/* Placeholder Fields */}
            <ScrollArea className="[&>[data-radix-scroll-area-viewport]]:max-h-[225px]">
                <div className="space-y-2">
                    {Object.keys(placeholderValueMap).length === 0
                        ? (
                            <div className="flex items-center text-sm text-muted-foreground">
                                No placeholders
                                found
                            </div>
                        )
                        : (
                            Object.keys(placeholderValueMap)
                                .map((placeholder) => (
                                    <div key={placeholder} className="space-y-1">
                                        <Label htmlFor={placeholder}>
                                            {toPlaceholderName(placeholder)}
                                        </Label>
                                        <Input
                                            id={placeholder}
                                            value={placeholderValueMap[placeholder] || ""}
                                            onChange={(e) => handlePlaceholderChange(placeholder, e.target.value)}
                                        />
                                    </div>
                                ))
                        )
                    }
                </div>
            </ScrollArea>

            {/* Replace Button */}
            <Button
                type="submit"
                disabled={Object.keys(placeholderValueMap).length === 0 || Object.values(placeholderValueMap).some(v => v.trim() === "")}
                className="w-full"
            >
                <ExternalLink/>
                Open
            </Button>
        </form>
    );
}

export default Popup;
