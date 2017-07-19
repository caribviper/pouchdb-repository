/**
 * Encapsulates an error messages with a title or category.
 */
export declare class CategoryError extends Error {
    readonly title: string;
    /**
     * Creates a new CategoryError messages
     * @param message Details of the message.
     * @param title Title/Category of the message
     */
    constructor(message?: string, title?: string);
}
