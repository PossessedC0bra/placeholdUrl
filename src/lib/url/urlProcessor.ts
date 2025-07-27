import { GLOBAL_PLACEHOLDER_REGEX } from "@/lib/placeholder/placeholderUtil";

export interface UrlParts {
    parts: [boolean, string][];
    placeholderValueMap: Record<string, string>;
}

export const processUrl = (url: string): UrlParts => {
    const urlParts = url
        .split(GLOBAL_PLACEHOLDER_REGEX)
        .map(part => [GLOBAL_PLACEHOLDER_REGEX.test(part), part] as [boolean, string]);

    const placeholderValueMap = urlParts
        .filter(([isPlaceholder]) => isPlaceholder)
        .reduce(
            (map, [, placeholder]) => {
                map[placeholder] = '';
                return map;
            },
            {} as Record<string, string>
        );

    return { parts: urlParts, placeholderValueMap };
};

export const resolveUrl = (plainUrl: string, placeholderValueMap: Record<string, string>): string => {
    let resolvedUrl = plainUrl;
    for (const [placeholder, val] of Object.entries(placeholderValueMap)) {
        resolvedUrl = resolvedUrl.replace(
            new RegExp(placeholder, 'g'),
            encodeURIComponent(val)
        );
    }
    return resolvedUrl;
};