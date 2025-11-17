/**
 * Snapshot Testing with Jest
 * Demonstrates: When to use snapshots, inline snapshots, best practices
 */

describe('Snapshot Testing', () => {
  describe('Object Snapshots', () => {
    interface User {
      id: string;
      name: string;
      email: string;
      createdAt: Date;
      preferences: {
        theme: string;
        notifications: boolean;
      };
    }

    function createUser(name: string, email: string): User {
      return {
        id: '123',
        name,
        email,
        createdAt: new Date('2024-01-01'),
        preferences: {
          theme: 'dark',
          notifications: true,
        },
      };
    }

    it('should match user object snapshot', () => {
      const user = createUser('John Doe', 'john@example.com');
      expect(user).toMatchSnapshot();
    });

    it('should match user with property matchers', () => {
      const user = createUser('Jane Doe', 'jane@example.com');

      // Use property matchers for dynamic values
      expect(user).toMatchSnapshot({
        id: expect.any(String),
        createdAt: expect.any(Date),
      });
    });

    it('should use inline snapshot for better visibility', () => {
      const user = createUser('Bob', 'bob@example.com');

      expect(user).toMatchInlineSnapshot(
        {
          id: expect.any(String),
          createdAt: expect.any(Date),
        },
        `
        {
          "createdAt": Any<Date>,
          "email": "bob@example.com",
          "id": Any<String>,
          "name": "Bob",
          "preferences": {
            "notifications": true,
            "theme": "dark",
          },
        }
      `
      );
    });
  });

  describe('Array Snapshots', () => {
    function generatePrimeNumbers(max: number): number[] {
      const primes: number[] = [];

      for (let num = 2; num <= max; num++) {
        let isPrime = true;
        for (let i = 2; i <= Math.sqrt(num); i++) {
          if (num % i === 0) {
            isPrime = false;
            break;
          }
        }
        if (isPrime) primes.push(num);
      }

      return primes;
    }

    it('should match prime numbers snapshot', () => {
      const primes = generatePrimeNumbers(20);
      expect(primes).toMatchSnapshot();
    });

    it('should match array inline snapshot', () => {
      const primes = generatePrimeNumbers(10);
      expect(primes).toMatchInlineSnapshot(`
        [
          2,
          3,
          5,
          7,
        ]
      `);
    });
  });

  describe('Error Snapshots', () => {
    class ValidationError extends Error {
      constructor(
        message: string,
        public field: string,
        public code: string
      ) {
        super(message);
        this.name = 'ValidationError';
      }
    }

    function validateEmail(email: string): void {
      if (!email.includes('@')) {
        throw new ValidationError('Invalid email format', 'email', 'INVALID_FORMAT');
      }
    }

    it('should match error snapshot', () => {
      expect(() => validateEmail('invalid')).toThrowErrorMatchingSnapshot();
    });

    it('should match error inline snapshot', () => {
      expect(() => validateEmail('bad-email')).toThrowErrorMatchingInlineSnapshot(
        `"Invalid email format"`
      );
    });
  });

  describe('Snapshot Best Practices', () => {
    /**
     * ✅ DO use snapshots for:
     * - Configuration objects
     * - API responses (when structure is important)
     * - Error messages
     * - Complex nested objects
     * - Generated code/markup
     *
     * ❌ DON'T use snapshots for:
     * - Simple values (use toBe instead)
     * - Frequently changing data
     * - Large payloads (hard to review)
     * - When you don't understand the output
     */

    interface APIResponse {
      status: number;
      data: {
        users: Array<{ id: number; name: string }>;
        total: number;
        page: number;
      };
    }

    function mockAPIResponse(): APIResponse {
      return {
        status: 200,
        data: {
          users: [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
          ],
          total: 2,
          page: 1,
        },
      };
    }

    it('✅ GOOD: Snapshot for structured API response', () => {
      const response = mockAPIResponse();
      expect(response).toMatchSnapshot();
    });

    it('❌ BAD: Snapshot for simple value (use toBe instead)', () => {
      const value = 42;
      // Don't do this:
      // expect(value).toMatchSnapshot();

      // Do this instead:
      expect(value).toBe(42);
    });

    it('✅ GOOD: Partial snapshot with property matchers', () => {
      const response = {
        id: Math.random(),
        timestamp: new Date(),
        data: 'test',
      };

      // Snapshot only stable parts
      expect(response).toMatchSnapshot({
        id: expect.any(Number),
        timestamp: expect.any(Date),
      });
    });
  });

  describe('Updating Snapshots', () => {
    /**
     * When to update snapshots:
     *
     * 1. ✅ Intentional change: You updated the code and output changed
     *    → Run: jest --updateSnapshot or jest -u
     *
     * 2. ❌ Test is failing: Don't blindly update!
     *    → Review the diff first
     *    → Understand WHY it changed
     *    → Only update if change is intentional
     *
     * 3. ✅ Refactoring: Code changed but behavior is same
     *    → Update snapshots
     *    → Verify manually first
     *
     * 4. ❌ Large snapshot changes: Be suspicious!
     *    → Probably indicates a bug
     *    → Review carefully
     */

    it('demonstrates snapshot update workflow', () => {
      const config = {
        version: '2.0.0', // Changed from 1.0.0
        features: ['auth', 'dashboard', 'reports'], // Added 'reports'
      };

      expect(config).toMatchInlineSnapshot(`
        {
          "features": [
            "auth",
            "dashboard",
            "reports",
          ],
          "version": "2.0.0",
        }
      `);
    });
  });

  describe('Snapshot Serializers', () => {
    // Custom serializer for dates (example)
    expect.addSnapshotSerializer({
      test: (val) => val instanceof Date,
      print: (val) => `Date<${(val as Date).toISOString()}>`,
    });

    it('should use custom serializer', () => {
      const data = {
        name: 'Test',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
      };

      expect(data).toMatchInlineSnapshot(`
        {
          "createdAt": Date<2024-01-01T00:00:00.000Z>,
          "name": "Test",
        }
      `);
    });
  });
});
