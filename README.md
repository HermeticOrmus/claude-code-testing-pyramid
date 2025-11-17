# 🧪 Testing Pyramid Complete

**Master every testing layer from unit to E2E**

Comprehensive testing guide covering unit, integration, E2E, visual regression, load, and contract testing. JavaScript and Python examples with production patterns.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Jest](https://img.shields.io/badge/Jest-ready-C21325)](https://jestjs.io/)
[![Playwright](https://img.shields.io/badge/Playwright-ready-2EAD33)](https://playwright.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## ✨ What's Included

✅ **Unit Testing**: Jest, Vitest, Pytest with patterns for all layers
✅ **Integration Testing**: Database, API, third-party service testing
✅ **E2E Testing**: Playwright and Cypress complete suites
✅ **Visual Regression**: Percy, Chromatic, BackstopJS integration
✅ **Load Testing**: k6, Artillery, JMeter production examples
✅ **Contract Testing**: Pact consumer-driven contracts
✅ **Mutation Testing**: Stryker for code quality assurance

## 🎯 Why This Guide?

| Feature | Our Guide | Jest Docs | Playwright Docs | Others |
|---------|-----------|-----------|-----------------|--------|
| Coverage | All layers | Unit only | E2E only | Partial |
| Languages | JS+Python | JS only | Multi | Single |
| Load Testing | Full k6 guide | None | None | Rare |
| Visual Testing | 3 tools | None | Screenshots | Basic |
| Contract Testing | Pact examples | None | None | Minimal |
| Documentation | 40k words | Scattered | Good | Limited |

### The Problem

Testing is fragmented:
- **Tools proliferate** - Jest vs Vitest vs Pytest, Playwright vs Cypress, k6 vs JMeter
- **Pyramid misunderstood** - Teams write wrong ratios (too many E2E, not enough unit)
- **Integration gap** - CI/CD setup unclear, local development painful
- **Production patterns missing** - Examples are toy apps, not real codebases
- **Cost unaddressed** - E2E tests expensive to run, load tests expensive to maintain

### The Solution

A **complete testing guide** that:
1. **Explains the pyramid** - Not just "what" but "why" at each layer
2. **Shows multiple tools** - Compare Jest vs Vitest, Playwright vs Cypress objectively
3. **Production patterns** - Real retry logic, flake reduction, parallel execution
4. **Multi-language** - JavaScript (TypeScript) + Python with same patterns
5. **Cost optimization** - How to test effectively without breaking CI budgets

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ and npm 10+
- **Python** 3.11+
- **Docker** (for integration tests with Testcontainers)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/claude-code-testing-pyramid.git
cd claude-code-testing-pyramid

# Install JavaScript dependencies
npm install

# Install Python dependencies
pip install -e ".[dev]"

# Install Playwright browsers
npx playwright install --with-deps
```

### Run Your First Tests

```bash
# Unit tests with Jest
npm run test:unit

# Unit tests with Vitest
npm run test:unit:vitest

# Integration tests
npm run test:integration

# E2E tests with Playwright
npm run test:e2e

# E2E tests with Cypress
npm run test:e2e:cypress

# Visual regression tests
npm run test:visual

# Mutation testing
npm run test:mutation

# Python unit tests
pytest examples/unit/pytest
```

---

## 📚 Repository Structure

```
claude-code-testing-pyramid/
├── examples/
│   ├── unit/
│   │   ├── jest/           # Jest unit test examples
│   │   ├── vitest/         # Vitest unit test examples
│   │   └── pytest/         # Pytest unit test examples
│   ├── integration/
│   │   ├── database/       # Database integration tests (Testcontainers)
│   │   ├── api/            # API integration tests (Supertest)
│   │   └── external/       # External service mocking (MSW)
│   ├── e2e/
│   │   ├── playwright/     # Playwright E2E tests
│   │   └── cypress/        # Cypress E2E tests
│   ├── visual/
│   │   ├── percy/          # Percy visual regression
│   │   ├── chromatic/      # Chromatic visual testing
│   │   └── backstop/       # BackstopJS self-hosted
│   ├── load/
│   │   ├── k6/             # k6 load testing scenarios
│   │   └── artillery/      # Artillery load tests
│   ├── contract/
│   │   └── pact/           # Pact contract testing
│   └── mutation/
│       └── stryker/        # Mutation testing examples
├── docs/
│   ├── guides/             # Comprehensive testing guides
│   ├── comparisons/        # Tool comparison documents
│   ├── patterns/           # Testing patterns and best practices
│   └── diagrams/           # Architecture diagrams
├── src/
│   ├── services/           # Business logic to test
│   ├── repositories/       # Data access layer
│   ├── controllers/        # API controllers
│   └── db/                 # Database utilities
└── tools/
    ├── helpers/            # Test helper utilities
    ├── reporters/          # Custom test reporters
    └── fixtures/           # Test data factories
```

---

## 🔺 The Testing Pyramid

The testing pyramid is a mental model for test distribution:

```
        /\
       /  \      E2E Tests (10%)
      /____\     - Slow, expensive, fragile
     /      \    - Test complete user journeys
    /        \   - Browser automation
   /   E2E    \
  /____________\
 /              \
/  Integration   \  Integration Tests (30%)
/________________\  - Medium speed, medium cost
/                  \ - Test component interactions
/  Unit Tests (60%) \- Database, APIs, services
/____________________\

         Unit Tests (60%)
         - Fast, cheap, reliable
         - Test individual functions
         - Isolated with mocks
```

### Why This Shape?

**Unit Tests (60%)**
- ⚡ **Fast**: < 100ms each
- 💰 **Cheap**: No infrastructure needed
- 🎯 **Focused**: One function, one test
- 🔄 **Feedback**: Immediate during development
- **Trade-off**: May miss integration bugs

**Integration Tests (30%)**
- ⚙️ **Realistic**: Real databases, real APIs
- 🔗 **Interactions**: Test component boundaries
- 🐛 **Bug Detection**: Catch miscommunication between parts
- **Trade-off**: Slower, require setup/teardown

**E2E Tests (10%)**
- 🌐 **Complete**: Full user journey
- 💡 **Confidence**: "It works in production"
- 🖥️ **Cross-browser**: Test all platforms
- **Trade-off**: Slow, flaky, expensive to maintain

---

## 🎓 Learning Path

### Beginner: Start Here

1. **Read**: [Testing Philosophy](docs/guides/01-testing-philosophy.md)
2. **Learn**: [Unit Testing Mastery](docs/guides/02-unit-testing-mastery.md)
3. **Practice**: Run Jest examples in `examples/unit/jest/`
4. **Understand**: [Test Doubles Guide](docs/patterns/test-doubles.md)

### Intermediate: Level Up

1. **Read**: [Integration Testing](docs/guides/03-integration-testing.md)
2. **Setup**: Database tests with Testcontainers
3. **Learn**: [API Testing Patterns](docs/patterns/api-testing.md)
4. **Practice**: Run integration examples

### Advanced: Production Ready

1. **Read**: [E2E Testing Guide](docs/guides/04-e2e-testing.md)
2. **Master**: [Flake Reduction](docs/patterns/flake-reduction.md)
3. **Optimize**: [CI/CD Best Practices](docs/patterns/ci-cd-optimization.md)
4. **Scale**: Load testing with k6

---

## 🧩 Testing Principles

### Arrange-Act-Assert (AAA Pattern)

```typescript
describe('UserService', () => {
  it('should create user with valid data', async () => {
    // Arrange: Set up test data and dependencies
    const userData = { email: 'test@example.com', name: 'Test User' };
    const mockDb = createMockDatabase();

    // Act: Execute the code under test
    const user = await userService.createUser(userData);

    // Assert: Verify the results
    expect(user.id).toBeDefined();
    expect(user.email).toBe(userData.email);
  });
});
```

### Test Independence

**Never do this:**
```typescript
// ❌ Bad: Tests depend on execution order
describe('Shopping Cart', () => {
  let cart;

  it('should add item', () => {
    cart = new Cart();
    cart.addItem('Product 1');
    expect(cart.items).toHaveLength(1);
  });

  it('should calculate total', () => {
    // Depends on previous test!
    expect(cart.getTotal()).toBe(29.99);
  });
});
```

**Do this instead:**
```typescript
// ✅ Good: Each test is independent
describe('Shopping Cart', () => {
  it('should add item', () => {
    const cart = new Cart();
    cart.addItem('Product 1');
    expect(cart.items).toHaveLength(1);
  });

  it('should calculate total', () => {
    const cart = new Cart();
    cart.addItem({ name: 'Product 1', price: 29.99 });
    expect(cart.getTotal()).toBe(29.99);
  });
});
```

### Descriptive Test Names

**Bad:**
```typescript
it('test1', () => { /* ... */ });
it('works', () => { /* ... */ });
it('edge case', () => { /* ... */ });
```

**Good:**
```typescript
it('should return user when valid ID provided', () => { /* ... */ });
it('should throw error when user not found', () => { /* ... */ });
it('should handle concurrent requests without data corruption', () => { /* ... */ });
```

---

## 🛠️ Tool Comparisons

### Jest vs Vitest

| Feature | Jest | Vitest |
|---------|------|--------|
| **Speed** | Moderate | Very Fast |
| **ESM Support** | Limited | Native |
| **Vite Integration** | None | Built-in |
| **Ecosystem** | Huge | Growing |
| **Learning Curve** | Low | Low |
| **Best For** | React/Node.js | Vite projects |

**When to use Jest**: Established projects, React ecosystem, large community support needed

**When to use Vitest**: Vite-based projects, need speed, prefer modern ESM

### Playwright vs Cypress

| Feature | Playwright | Cypress |
|---------|-----------|----------|
| **Multi-browser** | Yes (Chrome, Firefox, Safari, Edge) | Limited (Chrome, Firefox, Edge) |
| **Speed** | Faster | Fast |
| **Auto-waiting** | Yes | Yes |
| **Network Control** | Excellent | Good |
| **Mobile Testing** | Yes | Via viewports |
| **Learning Curve** | Moderate | Low |
| **Debugging** | Good | Excellent (time-travel) |

**When to use Playwright**: Multi-browser support needed, parallel execution, mobile testing

**When to use Cypress**: Developer experience priority, visual debugging, component testing

---

## 📖 Documentation

### Comprehensive Guides

1. [Testing Philosophy](docs/guides/01-testing-philosophy.md) - Pyramid, Trophy, Diamond models
2. [Unit Testing Mastery](docs/guides/02-unit-testing-mastery.md) - Jest, Vitest, Pytest deep dives
3. [Integration Testing](docs/guides/03-integration-testing.md) - Database, API, external services
4. [E2E Testing](docs/guides/04-e2e-testing.md) - Playwright and Cypress complete guides
5. [Advanced Testing](docs/guides/05-advanced-testing.md) - Visual, load, contract, mutation testing

### Pattern Guides

- [Test Doubles](docs/patterns/test-doubles.md) - Mocks, stubs, spies, fakes
- [Flake Reduction](docs/patterns/flake-reduction.md) - Make E2E tests reliable
- [CI/CD Optimization](docs/patterns/ci-cd-optimization.md) - Reduce costs and time
- [Test Data Management](docs/patterns/test-data-management.md) - Factories and fixtures

### Tool Comparisons

- [Jest vs Vitest](docs/comparisons/jest-vs-vitest.md)
- [Playwright vs Cypress](docs/comparisons/playwright-vs-cypress.md)
- [k6 vs Artillery vs JMeter](docs/comparisons/load-testing-tools.md)

---

## 🌟 Hermetic Principles

> "Testing isn't about achieving 100% coverage—it's about building confidence. Before writing tests, understand what confidence means for your system. A payment service needs different confidence than a blog. The pyramid is a mental model, not a law. Adapt it to your reality."

### Mentalism - Clear Mental Models

The testing pyramid is a **mental model**, not a rigid rule. Understand the principles:
- **Unit tests are fast** → Write many
- **E2E tests are slow** → Write few
- **Integration tests balance both** → Write enough

Your pyramid might be a diamond, trophy, or custom shape. That's okay.

### Correspondence - As Above, So Below

Your test structure should mirror your code structure:

```
src/services/UserService.ts  →  tests/unit/services/UserService.test.ts
src/api/controllers/UserController.ts  →  tests/unit/controllers/UserController.test.ts
```

### Vibration - Nothing Rests

Tests evolve with code. Refactor tests with the same care as production code. Delete obsolete tests. Update assertions when behavior changes intentionally.

### Polarity - Balance Forces

Every testing decision involves trade-offs:
- **Coverage ↔ Speed**: 100% coverage is slow, 0% is risky
- **Isolation ↔ Reality**: Mocks are fast but diverge from reality
- **Strictness ↔ Flexibility**: Strict assertions catch bugs but complicate refactoring

Find YOUR balance based on YOUR constraints.

### Rhythm - Testing Cadence

```
On save:    Unit tests (< 5 seconds)
On commit:  Unit + Integration (< 30 seconds)
On push:    Full suite (< 5 minutes)
Nightly:    E2E + Load tests (< 30 minutes)
Weekly:     Visual + Security (< 1 hour)
```

### Cause & Effect - Root Cause Analysis

When tests fail, investigate root causes:
1. **Race condition** (async timing)
2. **Shared state** (test order dependency)
3. **External service flakiness**
4. **Insufficient waits** (element not ready)

Fix the cause, not the symptom. Don't just increase timeouts.

### Gender - Structure + Adaptability

Balance strict structure (masculine) with flexibility (feminine):
- **Structure**: Naming conventions, coverage thresholds, CI checks
- **Flexibility**: `.skip()` for debugging, conditional execution, custom matchers

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Areas We Need Help

- **More examples**: Additional testing patterns
- **Tool updates**: Keep dependencies current
- **Documentation**: Improve clarity, fix typos
- **Translations**: Multi-language documentation
- **Bug fixes**: Report and fix issues

---

## 📊 Success Metrics

After using this guide, you should be able to:
- ✅ Explain testing pyramid trade-offs to your team
- ✅ Choose appropriate testing tools for your project
- ✅ Write flake-resistant E2E tests
- ✅ Set up comprehensive CI/CD pipelines
- ✅ Reduce test suite execution time by 50%
- ✅ Achieve meaningful (not just high) test coverage
- ✅ Debug and fix flaky tests systematically

---

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

This guide was built with [Claude Code](https://claude.ai) as part of the Hermetic Technology demonstration projects.

**Special thanks to:**
- Jest, Vitest, Pytest teams for excellent testing frameworks
- Playwright and Cypress teams for making E2E testing accessible
- k6 team for modern load testing
- Pact team for contract testing innovation
- The entire testing community for sharing knowledge

---

## 📞 Get Help

- **Issues**: [GitHub Issues](https://github.com/yourusername/claude-code-testing-pyramid/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/claude-code-testing-pyramid/discussions)
- **Email**: hello@hermetic-technology.com

---

**"Test with intention. Every test should answer: What breaks if this fails?"**

— Hermetic Ormus
