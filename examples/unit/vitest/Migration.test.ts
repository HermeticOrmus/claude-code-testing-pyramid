/**
 * Jest to Vitest Migration Guide
 * This file demonstrates the key differences and migration path
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Jest to Vitest Migration', () => {
  /**
   * STEP 1: Import Changes
   */
  describe('Imports', () => {
    it('shows import differences', () => {
      /**
       * Jest (globals enabled by default):
       * - No imports needed
       * - describe, it, expect are global
       *
       * Vitest (explicit imports):
       * - import { describe, it, expect } from 'vitest'
       * - Can enable globals in config if desired
       */
      expect(true).toBe(true);
    });
  });

  /**
   * STEP 2: Mock Function Changes
   */
  describe('Mocking', () => {
    it('demonstrates mock function migration', () => {
      /**
       * Jest:
       * const mock = jest.fn()
       * jest.spyOn(obj, 'method')
       * jest.clearAllMocks()
       *
       * Vitest:
       * const mock = vi.fn()
       * vi.spyOn(obj, 'method')
       * vi.clearAllMocks()
       */

      const mockFn = vi.fn();
      mockFn('test');
      expect(mockFn).toHaveBeenCalledWith('test');
    });

    it('demonstrates spy migration', () => {
      const obj = {
        method: () => 'original',
      };

      const spy = vi.spyOn(obj, 'method').mockReturnValue('mocked');

      expect(obj.method()).toBe('mocked');
      expect(spy).toHaveBeenCalled();

      spy.mockRestore();
    });
  });

  /**
   * STEP 3: Timer Changes
   */
  describe('Timers', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('demonstrates timer migration', async () => {
      /**
       * Jest:
       * jest.useFakeTimers()
       * jest.advanceTimersByTime(1000)
       * jest.runAllTimers()
       *
       * Vitest:
       * vi.useFakeTimers()
       * vi.advanceTimersByTime(1000) or await vi.advanceTimersByTimeAsync(1000)
       * vi.runAllTimers() or await vi.runAllTimersAsync()
       */

      const callback = vi.fn();
      setTimeout(callback, 1000);

      await vi.advanceTimersByTimeAsync(1000);
      expect(callback).toHaveBeenCalled();
    });
  });

  /**
   * STEP 4: Module Mocking
   */
  describe('Module Mocking', () => {
    it('demonstrates module mock migration', () => {
      /**
       * Jest:
       * jest.mock('../module')
       * jest.mock('../module', () => ({ default: mockedValue }))
       *
       * Vitest:
       * vi.mock('../module')
       * vi.mock('../module', () => ({ default: mockedValue }))
       *
       * Note: Vitest has better ESM support!
       */
    });
  });

  /**
   * STEP 5: Snapshot Testing
   */
  describe('Snapshots', () => {
    it('demonstrates snapshot migration', () => {
      /**
       * Jest:
       * expect(value).toMatchSnapshot()
       * expect(value).toMatchInlineSnapshot()
       *
       * Vitest:
       * Same API! No changes needed.
       */

      const obj = { name: 'test', value: 42 };
      expect(obj).toMatchSnapshot();
    });
  });

  /**
   * VITEST-SPECIFIC FEATURES
   */
  describe('Vitest-Specific Features', () => {
    it('demonstrates concurrent tests', { concurrent: true }, async () => {
      /**
       * Vitest allows concurrent test execution
       * Tests marked as concurrent run in parallel
       */
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(true).toBe(true);
    });

    it('demonstrates test.each migration', () => {
      /**
       * Jest:
       * test.each([...])('test %s', (input) => { })
       *
       * Vitest:
       * Same API! Works identically.
       */
    });
  });

  /**
   * MIGRATION CHECKLIST
   */
  describe('Migration Checklist', () => {
    it('provides migration steps', () => {
      /**
       * ✅ Step 1: Install Vitest
       *    npm install -D vitest
       *
       * ✅ Step 2: Update imports
       *    Add: import { describe, it, expect } from 'vitest'
       *
       * ✅ Step 3: Replace jest → vi
       *    Find & Replace: jest.fn() → vi.fn()
       *    Find & Replace: jest.spyOn() → vi.spyOn()
       *    Find & Replace: jest.mock() → vi.mock()
       *
       * ✅ Step 4: Update config
       *    Create vitest.config.ts
       *    Remove jest.config.js
       *
       * ✅ Step 5: Update package.json scripts
       *    "test": "vitest"
       *    "test:ui": "vitest --ui"
       *    "coverage": "vitest --coverage"
       *
       * ✅ Step 6: Run tests
       *    npm test
       *
       * ✅ Step 7: Fix any compatibility issues
       *    Most tests should work without changes!
       */
      expect(true).toBe(true);
    });
  });

  /**
   * BENEFITS OF VITEST
   */
  describe('Why Migrate to Vitest?', () => {
    it('lists benefits', () => {
      /**
       * 🚀 Speed:
       *    - Much faster than Jest
       *    - Powered by Vite's HMR
       *    - Tests run in milliseconds, not seconds
       *
       * 📦 ESM Support:
       *    - Native ESM support
       *    - No more ESM/CJS headaches
       *
       * 🔄 Hot Module Replacement:
       *    - Instant test re-runs
       *    - Only re-run changed tests
       *
       * 🎯 Vite Integration:
       *    - Uses same config as Vite
       *    - Share plugins and setup
       *
       * 🌈 Modern:
       *    - Built for modern JavaScript
       *    - TypeScript out of the box
       *
       * 💯 Compatible:
       *    - Jest-compatible API
       *    - Most tests work without changes
       *    - Easy migration path
       */
      expect('vitest').toBeTruthy();
    });
  });
});
