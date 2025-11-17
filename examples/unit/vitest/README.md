# Vitest Unit Testing Examples

Modern, fast unit testing with Vitest - the Vite-native testing framework.

## Why Vitest?

### Speed Comparison

| Framework | Test Suite Time | Watch Mode |
|-----------|----------------|------------|
| Jest | ~5 seconds | 2-3 seconds |
| Vitest | ~500ms | < 100ms |

### Key Advantages

1. **⚡ Lightning Fast**: Powered by Vite, tests run 10x faster than Jest
2. **🔥 Hot Module Replacement**: Instant test re-runs on file changes
3. **📦 Native ESM**: No more ESM/CJS configuration headaches
4. **🎯 Vite Integration**: Uses same config as your Vite build
5. **💯 Jest Compatible**: Most Jest tests work without changes
6. **🌈 Modern**: Built for modern JavaScript/TypeScript

## Examples Included

### 1. StringUtils.test.ts
- **Migration from Jest**: Same test, different syntax
- **Parameterized tests**: `it.each()` for data-driven tests
- **ESM imports**: Clean, modern imports

### 2. Calculator.test.ts
- **Benchmarking**: Performance testing with `bench()`
- **Complete test coverage**: All calculator operations
- **Vitest matchers**: Same as Jest, but faster

### 3. UserService.test.ts
- **Mocking with `vi`**: Vitest's mock utility
- **Async testing**: Promise and async/await patterns
- **Type safety**: Full TypeScript support

### 4. AsyncPatterns.test.ts
- **Fake timers**: `vi.useFakeTimers()`
- **Concurrent tests**: Run tests in parallel
- **Advanced async**: Retry logic, promises

### 5. Migration.test.ts
- **Complete migration guide**: Jest → Vitest
- **API comparison**: Side-by-side examples
- **Checklist**: Step-by-step migration process

## Running Vitest Tests

```bash
# Run all tests
npm run test:unit:vitest

# Watch mode (recommended!)
npm run test:unit:vitest -- --watch

# With UI (amazing for debugging)
npm run test:unit:vitest -- --ui

# Coverage
npm run test:unit:vitest -- --coverage

# Filter by name
npm run test:unit:vitest -- --grep="should create user"

# Run specific file
npm run test:unit:vitest StringUtils.test.ts
```

## Migration from Jest

### Step 1: Install Vitest

```bash
npm install -D vitest @vitest/ui
```

### Step 2: Update Imports

**Before (Jest):**
```typescript
// No imports needed (globals)
describe('MyTest', () => {
  it('works', () => {
    expect(true).toBe(true);
  });
});
```

**After (Vitest):**
```typescript
import { describe, it, expect } from 'vitest';

describe('MyTest', () => {
  it('works', () => {
    expect(true).toBe(true);
  });
});
```

### Step 3: Replace `jest` with `vi`

**Before (Jest):**
```typescript
const mock = jest.fn();
jest.spyOn(obj, 'method');
jest.mock('./module');
jest.useFakeTimers();
```

**After (Vitest):**
```typescript
import { vi } from 'vitest';

const mock = vi.fn();
vi.spyOn(obj, 'method');
vi.mock('./module');
vi.useFakeTimers();
```

### Step 4: Update Configuration

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Optional: enable global test functions
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
```

### Step 5: Update package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "coverage": "vitest --coverage"
  }
}
```

## API Comparison

### Mocking

| Jest | Vitest |
|------|--------|
| `jest.fn()` | `vi.fn()` |
| `jest.spyOn()` | `vi.spyOn()` |
| `jest.mock()` | `vi.mock()` |
| `jest.clearAllMocks()` | `vi.clearAllMocks()` |
| `jest.resetAllMocks()` | `vi.resetAllMocks()` |

### Timers

| Jest | Vitest |
|------|--------|
| `jest.useFakeTimers()` | `vi.useFakeTimers()` |
| `jest.advanceTimersByTime()` | `vi.advanceTimersByTime()` |
| `jest.runAllTimers()` | `vi.runAllTimers()` |
| `jest.clearAllTimers()` | `vi.clearAllTimers()` |

### Matchers

**Same in both!** All Jest matchers work in Vitest:
- `expect(value).toBe(expected)`
- `expect(value).toEqual(expected)`
- `expect(fn).toThrow()`
- `expect(promise).resolves.toBe(value)`
- etc.

## Vitest-Specific Features

### 1. Concurrent Tests

```typescript
import { it } from 'vitest';

// Run tests in parallel
it.concurrent('test 1', async () => {
  // async test
});

it.concurrent('test 2', async () => {
  // runs at the same time as test 1
});
```

### 2. Benchmarking

```typescript
import { bench } from 'vitest';

bench('sorting algorithm', () => {
  // code to benchmark
  [1, 2, 3].sort();
});
```

### 3. In-Source Testing

```typescript
// src/utils.ts
export function add(a, b) {
  return a + b;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('adds numbers', () => {
    expect(add(1, 2)).toBe(3);
  });
}
```

### 4. UI Mode

```bash
npm run test:unit:vitest -- --ui
```

Opens a beautiful web interface showing:
- Test results with rich diffs
- Coverage visualization
- Test execution timeline
- Module graph
- Console output

### 5. Watch Mode Intelligence

Vitest only re-runs:
- Tests that changed
- Tests that depend on changed modules
- Tests that previously failed

## Best Practices

### 1. Use TypeScript

```typescript
import { describe, it, expect } from 'vitest';

interface User {
  id: string;
  name: string;
}

it('creates user', () => {
  const user: User = { id: '1', name: 'Test' };
  expect(user).toBeDefined();
});
```

### 2. Leverage Concurrent Tests

```typescript
describe('API Tests', () => {
  // These can run in parallel
  it.concurrent('GET /users', async () => { });
  it.concurrent('GET /posts', async () => { });
  it.concurrent('GET /comments', async () => { });
});
```

### 3. Use Inline Snapshots

```typescript
it('matches snapshot', () => {
  expect(obj).toMatchInlineSnapshot(`
    {
      "name": "test",
      "value": 42,
    }
  `);
});
```

### 4. Enable Globals (Optional)

In `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    globals: true, // No need to import describe, it, expect
  },
});
```

Then in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

## Performance Tips

### 1. Use `--pool=threads` for CPU-intensive tests

```bash
vitest --pool=threads
```

### 2. Use `--pool=forks` for isolated tests

```bash
vitest --pool=forks
```

### 3. Configure test timeout

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 10000, // 10 seconds
  },
});
```

### 4. Exclude files

```typescript
export default defineConfig({
  test: {
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.git/**',
    ],
  },
});
```

## Debugging

### VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test:unit:vitest", "--", "--run"],
  "console": "integratedTerminal"
}
```

### Chrome DevTools

```bash
node --inspect-brk ./node_modules/vitest/vitest.js
```

Then open `chrome://inspect` in Chrome.

## Common Issues

### Issue: ESM modules not working

**Solution**: Ensure `type: "module"` in package.json or use `.mjs` extension.

### Issue: TypeScript errors

**Solution**: Add `"types": ["vitest/globals"]` to tsconfig.json.

### Issue: Mocks not working

**Solution**: Use `vi.mock()` at the top level, not inside tests.

## Next Steps

- ✅ **Integration Testing**: See `examples/integration/`
- ✅ **E2E Testing**: See `examples/e2e/playwright/`
- ✅ **Comparison**: Read `docs/comparisons/jest-vs-vitest.md`

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Migration Guide](https://vitest.dev/guide/migration.html)
- [Vite](https://vitejs.dev/)
