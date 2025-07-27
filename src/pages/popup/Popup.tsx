import { ExternalLink, Replace } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useHistoryStore } from "./PopupStore.ts";
import { usePopupState } from "@/hooks/usePopupState";
import { PlaceholderUrlPreview } from "@/components/PlaceholderUrlPreview";
import { PlaceholderInputs } from "@/components/PlaceholderInputs";
import { HistoryView } from "@/components/HistoryView";

function Popup() {
    const {
        plainUrl,
        urlParts,
        placeholderValueMap,
        handlePlaceholderChange,
        handleReplace,
        canSubmit
    } = usePopupState();

    const isHistoryExpanded = useHistoryStore(state => state.isHistoryExpanded);
    const [parent] = useAutoAnimate();

    return (
        <form
            ref={parent}
            onSubmit={handleReplace}
            className="w-[500px] max-h-[600px] py-3 flex flex-col gap-4"
        >
            {/* Header */}
            <div className="mx-3 flex items-center gap-2">
                <Replace />
                <span className="text-2xl font-bold">PlaceholdURL</span>
            </div>

            {!isHistoryExpanded && (
                <>
                    <div
                        key="urlPreview"
                        className="flex-none mx-4 p-2 bg-muted rounded-md border overflow-x-auto"
                    >
                        <PlaceholderUrlPreview 
                            urlParts={urlParts} 
                            placeholderValueMap={placeholderValueMap} 
                        />
                    </div>

                    <div
                        key="placeholders"
                        className="flex-1 px-4 overflow-y-auto flex flex-col [&>*:last-child]:pb-1 gap-1"
                    >
                        <PlaceholderInputs
                            placeholderValueMap={placeholderValueMap}
                            onPlaceholderChange={handlePlaceholderChange}
                        />
                    </div>
                </>
            )}

            {/* History View */}
            <HistoryView
                url={plainUrl}
                urlParts={urlParts}
            />

            {/* Replace Button */}
            {!isHistoryExpanded && (
                <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="mx-3"
                >
                    <ExternalLink />
                    Open
                </Button>
            )}
        </form>
    );
}

export default Popup;
