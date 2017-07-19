/**
 * Encapsulates an error messages with a title or category.
 */
export class CategoryError extends Error {
  /**
   * Creates a new CategoryError messages
   * @param message Details of the message.
   * @param title Title/Category of the message
   */
  constructor(message: string = '', readonly title: string = '') {
    super(message);
  }
}
