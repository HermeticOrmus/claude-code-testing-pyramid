/**
 * Async Testing Patterns with Jest
 * Demonstrates: Promises, async/await, timeouts, concurrent tests
 */

describe('Async Testing Patterns', () => {
  describe('Testing Promises', () => {
    function fetchUser(id: string): Promise<{ id: string; name: string }> {
      return Promise.resolve({ id, name: 'Test User' });
    }

    function fetchUserWithError(id: string): Promise<never> {
      return Promise.reject(new Error('User not found'));
    }

    it('should test promise with .resolves matcher', async () => {
      await expect(fetchUser('123')).resolves.toEqual({
        id: '123',
        name: 'Test User',
      });
    });

    it('should test promise rejection with .rejects matcher', async () => {
      await expect(fetchUserWithError('999')).rejects.toThrow('User not found');
    });

    it('should test promise with async/await', async () => {
      const user = await fetchUser('123');
      expect(user.name).toBe('Test User');
    });

    it('should test promise with return (Jest waits for promise)', () => {
      return fetchUser('123').then(user => {
        expect(user.name).toBe('Test User');
      });
    });
  });

  describe('Testing Timeouts and Delays', () => {
    function delayedFunction(ms: number): Promise<string> {
      return new Promise(resolve => {
        setTimeout(() => resolve('Done!'), ms);
      });
    }

    it('should test function with delay using fake timers', async () => {
      jest.useFakeTimers();

      const promise = delayedFunction(1000);

      // Fast-forward time
      jest.advanceTimersByTime(1000);

      await expect(promise).resolves.toBe('Done!');

      jest.useRealTimers();
    });

    it('should test function with real delay', async () => {
      const result = await delayedFunction(100);
      expect(result).toBe('Done!');
    }, 500); // Increase test timeout
  });

  describe('Testing Concurrent Operations', () => {
    async function fetchMultipleUsers(ids: string[]): Promise<any[]> {
      return Promise.all(
        ids.map(id => Promise.resolve({ id, name: `User ${id}` }))
      );
    }

    it('should test concurrent operations', async () => {
      const users = await fetchMultipleUsers(['1', '2', '3']);

      expect(users).toHaveLength(3);
      expect(users[0].id).toBe('1');
      expect(users[1].id).toBe('2');
      expect(users[2].id).toBe('3');
    });
  });

  describe('Testing Callbacks (Legacy Pattern)', () => {
    function fetchUserWithCallback(
      id: string,
      callback: (error: Error | null, user?: any) => void
    ): void {
      setTimeout(() => {
        if (id === '999') {
          callback(new Error('User not found'));
        } else {
          callback(null, { id, name: 'Test User' });
        }
      }, 10);
    }

    it('should test callback-based function', done => {
      fetchUserWithCallback('123', (error, user) => {
        expect(error).toBeNull();
        expect(user.name).toBe('Test User');
        done();
      });
    });

    it('should test callback error', done => {
      fetchUserWithCallback('999', (error, user) => {
        expect(error).toBeTruthy();
        expect(error?.message).toBe('User not found');
        done();
      });
    });
  });

  describe('Testing Event Emitters', () => {
    class EventEmitter {
      private listeners: Map<string, Function[]> = new Map();

      on(event: string, callback: Function): void {
        if (!this.listeners.has(event)) {
          this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(callback);
      }

      emit(event: string, ...args: any[]): void {
        const callbacks = this.listeners.get(event) || [];
        callbacks.forEach(callback => callback(...args));
      }
    }

    it('should test event emission', done => {
      const emitter = new EventEmitter();

      emitter.on('data', (data: string) => {
        expect(data).toBe('test data');
        done();
      });

      emitter.emit('data', 'test data');
    });

    it('should test event emission with mock', () => {
      const emitter = new EventEmitter();
      const mockCallback = jest.fn();

      emitter.on('data', mockCallback);
      emitter.emit('data', 'test data');

      expect(mockCallback).toHaveBeenCalledWith('test data');
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Testing Retry Logic', () => {
    class RetryService {
      private attempts = 0;

      async fetchWithRetry(maxRetries: number = 3): Promise<string> {
        this.attempts++;

        if (this.attempts < maxRetries) {
          throw new Error('Temporary failure');
        }

        return 'Success!';
      }

      reset(): void {
        this.attempts = 0;
      }
    }

    it('should succeed after retries', async () => {
      const service = new RetryService();

      // First two calls fail
      await expect(service.fetchWithRetry()).rejects.toThrow('Temporary failure');
      await expect(service.fetchWithRetry()).rejects.toThrow('Temporary failure');

      // Third call succeeds
      await expect(service.fetchWithRetry()).resolves.toBe('Success!');
    });
  });

  describe('Testing Race Conditions', () => {
    async function raceConditionTest(): Promise<string> {
      const fast = new Promise<string>(resolve => setTimeout(() => resolve('fast'), 10));
      const slow = new Promise<string>(resolve => setTimeout(() => resolve('slow'), 100));

      return Promise.race([fast, slow]);
    }

    it('should test Promise.race behavior', async () => {
      jest.useFakeTimers();

      const promise = raceConditionTest();

      jest.advanceTimersByTime(10);

      await expect(promise).resolves.toBe('fast');

      jest.useRealTimers();
    });
  });
});
