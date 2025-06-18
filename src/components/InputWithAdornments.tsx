import * as React from "react";
import {cn} from "@/lib/utils.ts";

type InputWithAdornmentsProps = {
    startAdornment?: React.ReactNode,
    endAdornment?: React.ReactNode,
} & React.ComponentProps<"input">;

function InputWithAdornments({
                                 startAdornment,
                                 endAdornment,
                                 className,
                                 ...props
                             }: InputWithAdornmentsProps) {
    return (
        <div
            className={cn(
                // input.tsx
                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                // InputWithAdornments.tsx
                "gap-2",
                className
            )}
        >
            {startAdornment && (
                <div className="flex items-center justify-center text-muted-foreground">
                    {startAdornment}
                </div>
            )}

            <input
                className={`flex-1 w-full bg-transparent outline-none`}
                {...props}
            />

            {endAdornment && (
                <div className="flex items-center justify-center text-muted-foreground">
                    {endAdornment}
                </div>
            )}
        </div>
    );
}

export {InputWithAdornments}
