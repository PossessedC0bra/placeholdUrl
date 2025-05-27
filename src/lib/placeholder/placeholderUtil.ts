const PLACEHOLDER_PREFIX = "{{";
const PLACEHOLDER_SUFFIX = "}}";
const GLOBAL_PLACEHOLDER_REGEX = new RegExp(`(${PLACEHOLDER_PREFIX}[a-zA-Z0-9-_]+${PLACEHOLDER_SUFFIX})`, 'g');

const toPlaceholderName = (placeholder: string): string => placeholder.replace(PLACEHOLDER_PREFIX, "").replace(PLACEHOLDER_SUFFIX, "");

export {
    PLACEHOLDER_PREFIX,
    PLACEHOLDER_SUFFIX,
    GLOBAL_PLACEHOLDER_REGEX,
    toPlaceholderName,
}
