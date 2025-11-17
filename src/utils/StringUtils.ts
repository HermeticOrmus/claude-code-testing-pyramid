/**
 * StringUtils - Utility functions for string manipulation
 * Simple functions to demonstrate basic unit testing
 */

export class StringUtils {
  /**
   * Capitalize the first letter of a string
   */
  static capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Slugify a string for URLs
   */
  static slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Truncate a string to a maximum length
   */
  static truncate(str: string, maxLength: number, suffix: string = '...'): string {
    if (!str || str.length <= maxLength) return str;
    return str.substring(0, maxLength - suffix.length) + suffix;
  }

  /**
   * Count words in a string
   */
  static wordCount(str: string): number {
    if (!str) return 0;
    return str.trim().split(/\s+/).length;
  }

  /**
   * Check if string is palindrome
   */
  static isPalindrome(str: string): boolean {
    if (!str) return false;
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
  }

  /**
   * Reverse a string
   */
  static reverse(str: string): string {
    return str.split('').reverse().join('');
  }

  /**
   * Check if string contains only letters
   */
  static isAlpha(str: string): boolean {
    return /^[a-zA-Z]+$/.test(str);
  }

  /**
   * Check if string contains only numbers
   */
  static isNumeric(str: string): boolean {
    return /^[0-9]+$/.test(str);
  }

  /**
   * Check if string contains only alphanumeric characters
   */
  static isAlphanumeric(str: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(str);
  }

  /**
   * Remove whitespace from string
   */
  static removeWhitespace(str: string): string {
    return str.replace(/\s/g, '');
  }
}
