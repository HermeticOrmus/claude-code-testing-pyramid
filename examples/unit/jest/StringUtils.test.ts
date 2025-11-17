/**
 * StringUtils Unit Tests with Jest
 * Demonstrates: Simple unit tests, edge cases, parameterized tests
 */

import { StringUtils } from '../../../src/utils/StringUtils';

describe('StringUtils', () => {
  describe('capitalize', () => {
    it('should capitalize first letter of lowercase string', () => {
      expect(StringUtils.capitalize('hello')).toBe('Hello');
    });

    it('should capitalize first letter and lowercase rest', () => {
      expect(StringUtils.capitalize('hELLO')).toBe('Hello');
    });

    it('should handle single character', () => {
      expect(StringUtils.capitalize('a')).toBe('A');
    });

    it('should return empty string for empty input', () => {
      expect(StringUtils.capitalize('')).toBe('');
    });

    it('should handle string with numbers', () => {
      expect(StringUtils.capitalize('123hello')).toBe('123hello');
    });
  });

  describe('slugify', () => {
    it('should convert spaces to hyphens', () => {
      expect(StringUtils.slugify('hello world')).toBe('hello-world');
    });

    it('should remove special characters', () => {
      expect(StringUtils.slugify('hello @world!')).toBe('hello-world');
    });

    it('should convert to lowercase', () => {
      expect(StringUtils.slugify('Hello World')).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
      expect(StringUtils.slugify('hello   world')).toBe('hello-world');
    });

    it('should trim leading and trailing hyphens', () => {
      expect(StringUtils.slugify('  hello world  ')).toBe('hello-world');
    });

    it('should handle underscores', () => {
      expect(StringUtils.slugify('hello_world')).toBe('hello-world');
    });
  });

  describe('truncate', () => {
    it('should truncate string longer than max length', () => {
      expect(StringUtils.truncate('hello world', 8)).toBe('hello...');
    });

    it('should not truncate string shorter than max length', () => {
      expect(StringUtils.truncate('hello', 10)).toBe('hello');
    });

    it('should use custom suffix', () => {
      expect(StringUtils.truncate('hello world', 8, '…')).toBe('hello w…');
    });

    it('should handle empty string', () => {
      expect(StringUtils.truncate('', 5)).toBe('');
    });

    it('should handle exact length match', () => {
      expect(StringUtils.truncate('hello', 5)).toBe('hello');
    });
  });

  describe('wordCount', () => {
    it('should count words in simple sentence', () => {
      expect(StringUtils.wordCount('hello world')).toBe(2);
    });

    it('should handle multiple spaces', () => {
      expect(StringUtils.wordCount('hello   world')).toBe(2);
    });

    it('should handle single word', () => {
      expect(StringUtils.wordCount('hello')).toBe(1);
    });

    it('should return 0 for empty string', () => {
      expect(StringUtils.wordCount('')).toBe(0);
    });

    it('should handle leading/trailing spaces', () => {
      expect(StringUtils.wordCount('  hello world  ')).toBe(2);
    });
  });

  describe('isPalindrome', () => {
    it('should return true for simple palindrome', () => {
      expect(StringUtils.isPalindrome('racecar')).toBe(true);
    });

    it('should return true for palindrome with spaces', () => {
      expect(StringUtils.isPalindrome('race car')).toBe(true);
    });

    it('should return true for palindrome with mixed case', () => {
      expect(StringUtils.isPalindrome('RaceCar')).toBe(true);
    });

    it('should return false for non-palindrome', () => {
      expect(StringUtils.isPalindrome('hello')).toBe(false);
    });

    it('should handle single character', () => {
      expect(StringUtils.isPalindrome('a')).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(StringUtils.isPalindrome(''))).toBe(false);
    });
  });

  describe('reverse', () => {
    it('should reverse string', () => {
      expect(StringUtils.reverse('hello')).toBe('olleh');
    });

    it('should handle single character', () => {
      expect(StringUtils.reverse('a')).toBe('a');
    });

    it('should handle empty string', () => {
      expect(StringUtils.reverse('')).toBe('');
    });
  });

  describe('isAlpha', () => {
    it('should return true for alphabetic string', () => {
      expect(StringUtils.isAlpha('hello')).toBe(true);
    });

    it('should return false for string with numbers', () => {
      expect(StringUtils.isAlpha('hello123')).toBe(false);
    });

    it('should return false for string with spaces', () => {
      expect(StringUtils.isAlpha('hello world')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(StringUtils.isAlpha('')).toBe(false);
    });
  });

  describe('isNumeric', () => {
    it('should return true for numeric string', () => {
      expect(StringUtils.isNumeric('123')).toBe(true);
    });

    it('should return false for string with letters', () => {
      expect(StringUtils.isNumeric('123abc')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(StringUtils.isNumeric('')).toBe(false);
    });
  });

  describe('isAlphanumeric', () => {
    it('should return true for alphanumeric string', () => {
      expect(StringUtils.isAlphanumeric('hello123')).toBe(true);
    });

    it('should return false for string with special characters', () => {
      expect(StringUtils.isAlphanumeric('hello@123')).toBe(false);
    });

    it('should return true for only letters', () => {
      expect(StringUtils.isAlphanumeric('hello')).toBe(true);
    });

    it('should return true for only numbers', () => {
      expect(StringUtils.isAlphanumeric('123')).toBe(true);
    });
  });

  describe('removeWhitespace', () => {
    it('should remove all whitespace', () => {
      expect(StringUtils.removeWhitespace('hello world')).toBe('helloworld');
    });

    it('should remove tabs and newlines', () => {
      expect(StringUtils.removeWhitespace('hello\tworld\n')).toBe('helloworld');
    });

    it('should handle string with no whitespace', () => {
      expect(StringUtils.removeWhitespace('hello')).toBe('hello');
    });
  });
});
