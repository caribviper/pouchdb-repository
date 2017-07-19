/**
 * Provides methods used throughout the system
 */
export declare class Utilities {
    /**
     * Gets a random identifier based on current time inconjunction with the Math.random method
     */
    static getRandomId(): string;
    /**Create a guid */
    static guid(): string;
    /**Aids in creating a guid */
    private static guid_s4();
    /**
     * Gets the property name of the passed property
     * @param property Field/property name to retrieved
     */
    static getPropertyName<TValue>(property: string | ((model) => TValue)): string;
}
