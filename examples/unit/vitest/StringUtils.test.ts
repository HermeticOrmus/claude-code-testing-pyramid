/**
 * StringUtils Tests with Vitest
 * Demonstrates: Migration from Jest, ESM support, Vitest API
 */

import { describe, it, expect } from 'vitest';
import { StringUtils } from '../../../src/utils/StringUtils';

/**
 * Key Differences from Jest:
 * 1. Import test functions from 'vitest' (no globals by default)
 * 2. Native ESM support (faster, more modern)
 * 3. Vite-powered (instant hot module replacement)
 * 4. Similar API to Jest (easy migration)
 */

describe('StringUtils with Vitest', () => {
  describe('capitalize', () => {
    it('should capitalize first letter of lowercase string', () => {
      expect(StringUtils.capitalize('hello')).toBe('Hello');
    });

    it('should capitalize first letter and lowercase rest', () => {
      expect(StringUtils.capitalize('hELLO')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(StringUtils.capitalize('')).toBe('');
    });
  });

  describe('slugify', () => {
    it('should convert spaces to hyphens', () => {
      expect(StringUtils.slugify('hello world')).toBe('hello-world');
    });

    it('should remove special characters', () => {
      expect(StringUtils.slugify('hello @world!')).toBe('hello-world');
    });

    it('should handle underscores', () => {
      expect(StringUtils.slugify('hello_world')).toBe('hello-world');
    });
  });

  describe('isPalindrome', () => {
    // Vitest supports test.each for parameterized tests
    it.each([
      ['racecar', true],
      ['A man a plan a canal Panama', true],
      ['hello', false],
      ['', false],
    ])('should check if "%s" is palindrome: %s', (input, expected) => {
      expect(StringUtils.isPalindrome(input)).toBe(expected);
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(StringUtils.truncate('hello world', 8)).toBe('hello...');
    });

    it('should not truncate short strings', () => {
      expect(StringUtils.truncate('hello', 10)).toBe('hello');
    });
  });
});
