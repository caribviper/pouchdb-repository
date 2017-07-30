/**
 * Provides methods used throughout the system
 */
export class Utilities {
  /**
   * Gets a random identifier based on current time inconjunction with the Math.random method
   */
  public static getRandomId(): string {
    return `${Date.now().toString()}${Math.floor((Math.random() * 10000000000000000))}`;
  }

  /**Create a guid */
  public static guid(): string {
    return Utilities.guid_s4() + Utilities.guid_s4() + '-' + Utilities.guid_s4() + '-' + Utilities.guid_s4() + '-' +
      Utilities.guid_s4() + '-' + Utilities.guid_s4() + Utilities.guid_s4() + Utilities.guid_s4();
  }

  /**Aids in creating a guid */
  private static guid_s4(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  /**
   * Gets the property name of the passed property
   * @param property Field/property name to retrieved
   */
  public static getPropertyName<TValue>(property: string | ((model) => TValue)): string {
    if (typeof property === 'string')
      return property as string;
    const name = property.toString();
    const start = name.indexOf('.');
    const end = name.length;
    if (start > -1 && end > 0)
      return name.substring(start + 1, end);
    return '';
  }
}
