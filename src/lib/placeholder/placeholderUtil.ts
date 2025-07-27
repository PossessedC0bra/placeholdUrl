const PLACEHOLDER_PREFIX = "{{";
const PLACEHOLDER_SUFFIX = "}}";
const GLOBAL_PLACEHOLDER_REGEX = new RegExp(`(${PLACEHOLDER_PREFIX}[a-zA-Z0-9-_]+${PLACEHOLDER_SUFFIX})`, 'g');

/**
 * Converts a placeholder string to a readable name
 * @param placeholder - The placeholder string (e.g., "{{username}}")
 * @returns The placeholder name without brackets (e.g., "username")
 */
const toPlaceholderName = (placeholder: string): string => 
    placeholder.replace(PLACEHOLDER_PREFIX, "").replace(PLACEHOLDER_SUFFIX, "");

/**
 * Creates a placeholder string from a name
 * @param name - The placeholder name (e.g., "username")
 * @returns The placeholder string with brackets (e.g., "{{username}}")
 */
const toPlaceholder = (name: string): string => 
    `${PLACEHOLDER_PREFIX}${name}${PLACEHOLDER_SUFFIX}`;

/**
 * Validates if a string is a valid placeholder
 * @param placeholder - The string to validate
 * @returns True if the string is a valid placeholder
 */
const isValidPlaceholder = (placeholder: string): boolean => {
    return GLOBAL_PLACEHOLDER_REGEX.test(placeholder);
};

/**
 * Extracts all placeholders from a URL
 * @param url - The URL string to extract placeholders from
 * @returns Array of placeholder strings found in the URL
 */
const extractPlaceholders = (url: string): string[] => {
    const matches = url.match(GLOBAL_PLACEHOLDER_REGEX);
    return matches || [];
};

/**
 * Validates if a placeholder name is valid (alphanumeric, hyphens, and underscores only)
 * @param name - The placeholder name to validate
 * @returns True if the name is valid
 */
const isValidPlaceholderName = (name: string): boolean => {
    return /^[a-zA-Z0-9-_]+$/.test(name);
};

export {
    PLACEHOLDER_PREFIX,
    PLACEHOLDER_SUFFIX,
    GLOBAL_PLACEHOLDER_REGEX,
    toPlaceholderName,
    toPlaceholder,
    isValidPlaceholder,
    extractPlaceholders,
    isValidPlaceholderName,
};
