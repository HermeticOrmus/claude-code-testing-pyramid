/**
 * Async Testing Patterns with Vitest
 * Demonstrates: Promise testing, fake timers, concurrent tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Async Patterns with Vitest', () => {
  describe('Promise Testing', () => {
    async function fetchUser(id: string) {
      if (id === '999') {
        throw new Error('User not found');
      }
      return { id, name: 'Test User' };
    }

    it('should resolve promise', async () => {
      await expect(fetchUser('123')).resolves.toEqual({
        id: '123',
        name: 'Test User',
      });
    });

    it('should reject promise', async () => {
      await expect(fetchUser('999')).rejects.toThrow('User not found');
    });

    it('should test with async/await', async () => {
      const user = await fetchUser('123');
      expect(user.name).toBe('Test User');
    });
  });

  describe('Fake Timers', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    function delayed(ms: number): Promise<string> {
      return new Promise(resolve => {
        setTimeout(() => resolve('Done!'), ms);
      });
    }

    it('should fast-forward time', async () => {
      const promise = delayed(1000);

      // Advance time
      await vi.advanceTimersByTimeAsync(1000);

      await expect(promise).resolves.toBe('Done!');
    });

    it('should run all timers', async () => {
      const callback = vi.fn();

      setTimeout(callback, 100);
      setTimeout(callback, 200);

      await vi.runAllTimersAsync();

      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe('Concurrent Tests', () => {
    // Vitest's concurrent mode: Run tests in parallel
    it.concurrent('test 1', async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(true).toBe(true);
    });

    it.concurrent('test 2', async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(true).toBe(true);
    });

    it.concurrent('test 3', async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(true).toBe(true);
    });
  });

  describe('Testing Retries', () => {
    class RetryService {
      private attempts = 0;

      async fetchWithRetry(maxRetries: number = 3): Promise<string> {
        this.attempts++;
        if (this.attempts < maxRetries) {
          throw new Error('Temporary failure');
        }
        return 'Success!';
      }
    }

    it('should succeed after retries', async () => {
      const service = new RetryService();

      await expect(service.fetchWithRetry()).rejects.toThrow();
      await expect(service.fetchWithRetry()).rejects.toThrow();
      await expect(service.fetchWithRetry()).resolves.toBe('Success!');
    });
  });
});
