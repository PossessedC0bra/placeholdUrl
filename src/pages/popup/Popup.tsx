import {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Check, ChevronDown, ChevronUp, ExternalLink, Pencil, Replace, Search, X, History} from "lucide-react";
import {GLOBAL_PLACEHOLDER_REGEX, toPlaceholderName} from "@/lib/placeholder/placeholderUtil";
import {Label} from "@/components/ui/label";
import {InputWithAdornments} from "@/components/InputWithAdornments.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Card, CardContent, CardFooter} from "@/components/ui/card.tsx";
import {useHistoryStore, type HistoryItem} from "@/pages/popup/PopupStore.ts";
import {cn} from "@/lib/utils.ts";
import { useAutoAnimate } from "@formkit/auto-animate/react";

function Popup() {
    const [tab, setTab] = useState<chrome.tabs.Tab | null>(null);
    const [plainUrl, setPlainUrl] = useState("");
    const [urlParts, setUrlParts] = useState<[boolean, string][]>([]);
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

            const urlParts = plainUrl
                .split(GLOBAL_PLACEHOLDER_REGEX)
                .map(part => [GLOBAL_PLACEHOLDER_REGEX.test(part), part] as [boolean, string]);
            setUrlParts(urlParts);

            setPlaceholderValueMap(urlParts
                .filter(([isPlaceholder]) => isPlaceholder)
                .reduce(
                    (map, [, placeholder]) => {
                        map[placeholder] = '';
                        return map;
                    },
                    {} as Record<string, string>
                ));
        })();
    }, []);

    const addHistoryItem = useHistoryStore(state => state.addHistoryItem);
    const isHistoryExpanded = useHistoryStore(state => state.isHistoryExpanded);

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

        // Save to history
        const historyItem: HistoryItem = {
            id: Date.now(), // Use timestamp as a unique ID
            name: resolvedUrl,
            placeholders: placeholderValueMap,
            lastUsed: Date.now(),
            usageCount: 1
        };
        addHistoryItem(plainUrl, historyItem);

        await chrome.tabs.update(tab!.id!, {url: resolvedUrl});
        window.close(); // Close the popup after replacing
    };

    const [parent] = useAutoAnimate();
    return (
        <form
            ref={parent}
            onSubmit={handleReplace}
            className="w-[500px] max-h-[600px] py-3 flex flex-col gap-4"
        >
            {/* Header */}
            <div className="mx-3 flex items-center gap-2">
                <Replace/>
                <span className="text-2xl font-bold">PlaceholdURL</span>
            </div>

            {!isHistoryExpanded
                && <>
                    <div
                        key="urlPreview"
                        className={`flex-none mx-4 p-2 bg-muted rounded-md border overflow-x-auto`}
                    >
                        <PlaceholderUrlPreview urlParts={urlParts} placeholderValueMap={placeholderValueMap}/>
                    </div>

                    <div
                        key="placeholders"
                        className={`flex-1 px-4 overflow-y-auto flex flex-col [&>*:last-child]:pb-1 gap-1`}
                    >
                        {Object.keys(placeholderValueMap).length === 0
                            ? <div className="text-center text-sm text-muted-foreground">No placeholders found</div>
                            : <>
                                {Object.keys(placeholderValueMap)
                                    .map((placeholder, idx) => (
                                        <div key={placeholder} className="space-y-1">
                                            <Label htmlFor={placeholder}>{toPlaceholderName(placeholder)}</Label>
                                            <Input
                                                id={placeholder}
                                                className="focus-visible:z-10"
                                                value={placeholderValueMap[placeholder] || ""}
                                                onChange={(e) => handlePlaceholderChange(placeholder, e.target.value)}
                                                autoFocus={idx === 0}
                                            />
                                        </div>
                                    ))
                                }
                            </>
                        }
                    </div>
                </>
            }

            {/* History View */}
            <HistoryView
                url={plainUrl}
                urlParts={urlParts}
            />

            {/* Replace Button */}
            {!isHistoryExpanded
                && <Button
                    type="submit"
                    disabled={Object.keys(placeholderValueMap).length === 0 || Object.values(placeholderValueMap).some(v => v.trim() === "")}
                    className="mx-3"
                >
                    <ExternalLink/>
                    Open
                </Button>
            }
        </form>
    );
}

const PlaceholderUrlPreview = ({urlParts, placeholderValueMap, className}: {
    urlParts: [boolean, string][],
    placeholderValueMap: Record<string, string>
    className?: string
}) => (
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

const HistoryView = ({url, urlParts}: { url: string, urlParts: [boolean, string][] }) => {
    const isExpanded = useHistoryStore(state => state.isHistoryExpanded);
    const setIsExpanded = useHistoryStore(state => state.setHistoryExpanded);

    const historyStore = useHistoryStore(state => state.history);
    const history = historyStore[url] || [];

    const [searchQuery, setSearchQuery] = useState('');

    const [historyView] = useAutoAnimate();
    const [historyList] = useAutoAnimate();

    return history.length === 0
        ? null
        : <div
            ref={historyView}
            className={`${!isExpanded ? "flex-none" : "flex-1"} px-4 overflow-y-hidden flex flex-col gap-2`}
        >
            <HistoryHeader itemCount={history.length}/>
            {isExpanded
                && <div className="flex items-center gap-2">
                    <InputWithAdornments
                        startAdornment={<Search/>}
                        placeholder={'Search...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Select>
                        <SelectTrigger className="">
                            <SelectValue placeholder="Sort by..."/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="lastUsed">Last Used</SelectItem>
                            <SelectItem value="usageCount">Usage Count</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            }
            <div
                ref={historyList}
                className={`${!isExpanded ? "flex-none max-h-[120px] snap-y snap-mandatory" : "flex-auto"} overflow-y-auto flex flex-col gap-2`}
            >
                {history
                    .filter(h => h.name.toLowerCase().includes(searchQuery))
                    .map((item) => (
                        <HistoryCard
                            key={item.name}
                            urlParts={urlParts}
                            item={item}
                            onRemove={() => {
                                setIsExpanded(isExpanded && history.length > 1)
                            }}
                        />
                    ))}
            </div>
        </div>

}

const HistoryHeader = ({itemCount}: { itemCount: number }) => {
    const isExpanded = useHistoryStore(state => state.isHistoryExpanded);
    const setIsExpanded = useHistoryStore(state => state.setHistoryExpanded);

    return <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
            <History/> History <Badge variant="secondary">{itemCount} items</Badge>
        </div>

        <Button
            type="button"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {isExpanded
                ? <><ChevronDown/> Collapse</>
                : <><ChevronUp/> Expand</>
            }
        </Button>
    </div>
}

const HistoryCard = ({urlParts, item, onRemove}: {
    urlParts: [boolean, string][],
    item: HistoryItem,
    onRemove: (item: HistoryItem) => void
}) =>
    (
        <Card className="p-4 gap-2 flex flex-row snap-center group">
            <CardContent className="overflow-x-hidden px-0 space-y-1">
                <HistoryItemName itemName={item.name}/>

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
                    <X/>
                </Button>
            </CardFooter>
        </Card>
    );

const HistoryItemName = ({itemName}: { itemName: string }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(itemName);

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
                        <Pencil/>
                    </Button>
                </div>
            )
            : (
                <div className="flex flex-row items-center">
                    <Input
                        className="text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Button
                        variant="ghost"
                        className="text-success hover:bg-success/20 hover:text-success"
                        onClick={() => {
                            setIsEditing(false);
                        }}
                    >
                        <Check/>
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setName(itemName);
                            setIsEditing(false);
                        }}
                    >
                        <X/>
                    </Button>
                </div>
            )
        }
    </>
};

export default Popup;
