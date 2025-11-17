# Jest Unit Testing Examples

This directory contains comprehensive Jest unit testing examples demonstrating production-ready testing patterns.

## Examples Included

### 1. UserService.test.ts
**Topics Covered:**
- Mocking dependencies with `jest.fn()` and `jest.mock()`
- Async/await testing
- Error handling and validation
- Testing edge cases
- Parameterized testing patterns

**Key Patterns:**
```typescript
// Mocking a database client
const mockDb = {
  users: {
    create: jest.fn(),
    findByEmail: jest.fn(),
  },
};

// Testing async functions
await expect(userService.createUser(data)).resolves.toBeDefined();
await expect(userService.createUser(badData)).rejects.toThrow();
```

### 2. OrderService.test.ts
**Topics Covered:**
- Complex service with multiple dependencies
- Testing compensation logic (saga pattern)
- Verifying call order and interactions
- Testing different failure scenarios
- Business logic validation

**Key Patterns:**
```typescript
// Verify compensation when payment fails
mockPaymentGateway.charge.mockRejectedValue(new Error('Payment failed'));
await expect(orderService.placeOrder(data)).rejects.toThrow();
expect(mockInventory.releaseReservation).toHaveBeenCalled();
```

### 3. StringUtils.test.ts
**Topics Covered:**
- Testing pure functions
- Edge case coverage
- Boundary testing
- Testing with different input types
- Regex validation testing

**Key Patterns:**
```typescript
// Testing edge cases
expect(StringUtils.capitalize('')).toBe('');
expect(StringUtils.isPalindrome('racecar')).toBe(true);
expect(StringUtils.slugify('Hello World!')).toBe('hello-world');
```

### 4. Calculator.test.ts
**Topics Covered:**
- Test-Driven Development (TDD) approach
- Mathematical operation testing
- Error boundary testing
- Floating point comparison (`toBeCloseTo`)
- Comprehensive test coverage

**Key Patterns:**
```typescript
// Testing errors
expect(() => calculator.divide(10, 0)).toThrow('Division by zero');

// Floating point comparison
expect(calculator.divide(10, 3)).toBeCloseTo(3.333);
```

### 5. TestDoubles.test.ts
**Topics Covered:**
- **Mocks**: Verify interactions
- **Stubs**: Provide canned responses
- **Spies**: Observe real implementations
- **Fakes**: Simplified working implementations
- When to use each type

**Key Patterns:**
```typescript
// Mock: Verify behavior
const mock = jest.fn();
service.doSomething();
expect(mock).toHaveBeenCalledWith(expectedArgs);

// Stub: Control return values
const stub = jest.fn().mockReturnValue(42);

// Spy: Observe real object
const spy = jest.spyOn(object, 'method');

// Fake: Working implementation
class FakeDatabase implements Database {
  private data = new Map();
  // ... implementation
}
```

### 6. AsyncPatterns.test.ts
**Topics Covered:**
- Promise testing (`resolves`, `rejects`)
- Async/await patterns
- Testing timeouts and delays
- Concurrent operations
- Callback testing (legacy)
- Event emitter testing
- Retry logic testing

**Key Patterns:**
```typescript
// Promise matchers
await expect(fetchUser()).resolves.toEqual(expectedUser);
await expect(fetchUser()).rejects.toThrow();

// Fake timers
jest.useFakeTimers();
jest.advanceTimersByTime(1000);
jest.useRealTimers();
```

### 7. SnapshotTesting.test.ts
**Topics Covered:**
- When to use snapshots
- Inline snapshots vs external
- Property matchers for dynamic values
- Updating snapshots safely
- Best practices and anti-patterns
- Custom serializers

**Key Patterns:**
```typescript
// Basic snapshot
expect(object).toMatchSnapshot();

// Property matchers
expect(user).toMatchSnapshot({
  id: expect.any(String),
  createdAt: expect.any(Date),
});

// Inline snapshot
expect(value).toMatchInlineSnapshot(`expected value`);
```

## Running the Tests

```bash
# Run all Jest tests
npm run test:unit

# Run in watch mode
npm run test:unit:watch

# Run with coverage
npm run test:unit -- --coverage

# Run specific test file
npm run test:unit -- UserService.test.ts

# Update snapshots
npm run test:unit -- -u

# Run tests matching a pattern
npm run test:unit -- --testNamePattern="should create user"
```

## Test Organization

### AAA Pattern (Arrange-Act-Assert)

All tests follow the AAA pattern:

```typescript
it('should do something', () => {
  // Arrange: Set up test data and dependencies
  const input = 'test';
  const expected = 'TEST';

  // Act: Execute the code under test
  const result = transform(input);

  // Assert: Verify the results
  expect(result).toBe(expected);
});
```

### Descriptive Test Names

Test names should describe the behavior:

```typescript
// ✅ Good
it('should return null when user not found')
it('should throw ValidationError for invalid email')
it('should retry 3 times before failing')

// ❌ Bad
it('test1')
it('works')
it('edge case')
```

### Test Independence

Each test should be independent:

```typescript
// ✅ Good: Fresh setup for each test
beforeEach(() => {
  mockDb = createMockDatabase();
  service = new UserService(mockDb);
});

// ❌ Bad: Shared state between tests
let user; // Don't share state!
it('creates user', () => {
  user = service.create();
});
it('deletes user', () => {
  service.delete(user.id); // Depends on previous test!
});
```

## Jest Configuration

See `jest.config.js` in the root directory for:
- TypeScript support via `ts-jest`
- Coverage thresholds
- Test environment setup
- Module path mapping
- Custom matchers

## Best Practices

### 1. Keep Tests Focused
- One assertion per test (when practical)
- Test one behavior at a time
- Avoid testing implementation details

### 2. Use Meaningful Mocks
```typescript
// ✅ Good: Clear mock behavior
mockDb.findUser.mockResolvedValue(expectedUser);

// ❌ Bad: Unclear mock
mockDb.findUser.mockReturnValue(Promise.resolve({ data: {} }));
```

### 3. Test Edge Cases
- Empty arrays/strings
- Null/undefined values
- Boundary values (0, -1, MAX_INT)
- Error conditions

### 4. Clean Up After Tests
```typescript
afterEach(() => {
  jest.clearAllMocks(); // Clear mock call history
  jest.restoreAllMocks(); // Restore original implementations
});
```

### 5. Avoid Over-Mocking
```typescript
// ✅ Good: Mock only external dependencies
const mockDb = jest.fn();

// ❌ Bad: Mocking everything (testing nothing!)
const mockEverything = jest.fn();
```

## Common Matchers

```typescript
// Equality
expect(value).toBe(expected); // Strict equality (===)
expect(object).toEqual(expected); // Deep equality

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Numbers
expect(value).toBeGreaterThan(10);
expect(value).toBeLessThan(100);
expect(value).toBeCloseTo(3.14, 2); // Floating point

// Strings
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');

// Arrays/Iterables
expect(array).toContain(item);
expect(array).toHaveLength(3);
expect(array).toEqual(expect.arrayContaining([1, 2]));

// Objects
expect(object).toHaveProperty('key');
expect(object).toMatchObject({ key: 'value' });

// Exceptions
expect(() => fn()).toThrow();
expect(() => fn()).toThrow(ErrorClass);
expect(() => fn()).toThrow('error message');

// Async
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();

// Mocks
expect(mock).toHaveBeenCalled();
expect(mock).toHaveBeenCalledTimes(1);
expect(mock).toHaveBeenCalledWith(arg1, arg2);
```

## Learning Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Testing JavaScript with Kent C. Dodds](https://testingjavascript.com/)

## Next Steps

After mastering Jest:
1. Explore **Vitest** (modern alternative): `examples/unit/vitest/`
2. Learn **Integration Testing**: `examples/integration/`
3. Master **E2E Testing**: `examples/e2e/playwright/`
