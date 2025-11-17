# Contributing to Testing Pyramid Complete

Thank you for your interest in contributing! This guide will help you get started.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Running Tests](#running-tests)
- [Contributing Guidelines](#contributing-guidelines)
- [Code Style](#code-style)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Getting Started

### Prerequisites

- **Node.js** 20+ and npm 10+
- **Python** 3.11+
- **Docker** (for integration tests)
- **Git**

### Development Setup

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

## Running Tests

### Unit Tests

```bash
# Jest
npm run test:unit

# Vitest
npm run test:unit:vitest

# Pytest
pytest examples/unit/pytest
```

### All Tests

```bash
npm test
```

### With Coverage

```bash
npm run test:unit -- --coverage
```

## Contributing Guidelines

### What We're Looking For

- **More examples**: Additional testing patterns and real-world scenarios
- **Documentation improvements**: Clarify existing docs, fix typos, add diagrams
- **Tool updates**: Keep dependencies current, add new testing tools
- **Bug fixes**: Report and fix issues
- **Translations**: Multi-language documentation

### What to Avoid

- Large refactors without discussion
- Adding dependencies without justification
- Breaking changes without migration guides
- Undocumented code

## Code Style

### TypeScript/JavaScript

- Use **TypeScript** for all new code
- Follow **ESLint** configuration
- Use **Prettier** for formatting
- Write **JSDoc comments** for public APIs

```typescript
/**
 * Calculate the average of an array of numbers
 * @param numbers - Array of numbers to average
 * @returns The average value
 * @throws {Error} If array is empty
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) {
    throw new Error('Cannot calculate average of empty array');
  }
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}
```

### Python

- Follow **PEP 8**
- Use **Black** for formatting
- Use **type hints**
- Write **docstrings**

```python
def average(numbers: list[float]) -> float:
    """
    Calculate the average of a list of numbers.

    Args:
        numbers: List of numbers to average

    Returns:
        The average value

    Raises:
        ValueError: If list is empty
    """
    if not numbers:
        raise ValueError("Cannot calculate average of empty list")

    return sum(numbers) / len(numbers)
```

### Test Naming

```typescript
// ✅ Good: Descriptive test names
it('should return user when valid ID provided')
it('should throw ValidationError for invalid email')
it('should retry 3 times before failing')

// ❌ Bad: Unclear test names
it('test1')
it('works')
it('edge case')
```

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(jest): add snapshot testing examples

Added comprehensive snapshot testing examples showing:
- Basic object snapshots
- Inline snapshots
- Property matchers for dynamic values
- Best practices and anti-patterns

Closes #42
```

```
fix(vitest): correct import statement in migration guide

The import statement was missing the 'vi' import needed for
mocking examples.
```

```
docs(readme): update installation instructions

Added clarification about Python version requirements and
optional dependencies.
```

## Pull Request Process

### 1. Create a Feature Branch

```bash
git checkout -b feat/add-mutation-testing-examples
```

### 2. Make Your Changes

- Write code following our style guides
- Add tests for new functionality
- Update documentation as needed
- Run tests locally

### 3. Commit Your Changes

```bash
git add .
git commit -m "feat(examples): add mutation testing with Stryker"
```

### 4. Push to GitHub

```bash
git push origin feat/add-mutation-testing-examples
```

### 5. Create Pull Request

- Go to GitHub and create a pull request
- Fill out the PR template
- Link any related issues
- Wait for review

### 6. Address Feedback

- Make requested changes
- Push updates to the same branch
- Request re-review when ready

### 7. Merge

Once approved, a maintainer will merge your PR.

## Code Review Guidelines

### For Contributors

- Be open to feedback
- Respond to comments promptly
- Ask questions if unclear
- Don't take feedback personally

### For Reviewers

- Be kind and constructive
- Explain "why" not just "what"
- Praise good work
- Suggest alternatives

## Testing Guidelines

### Test Coverage

- **Unit tests**: Aim for 70%+ coverage
- **Integration tests**: Cover critical paths
- **E2E tests**: Cover main user flows

### Test Quality

- Each test should test one thing
- Tests should be independent
- Use descriptive test names
- Follow AAA pattern (Arrange-Act-Assert)

### Example Test

```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };
      const mockDb = createMockDatabase();

      // Act
      const user = await userService.createUser(userData);

      // Assert
      expect(user.id).toBeDefined();
      expect(user.email).toBe(userData.email);
    });
  });
});
```

## Documentation Guidelines

### Writing Style

- Use clear, concise language
- Write in active voice
- Include code examples
- Explain "why" not just "how"
- Add diagrams when helpful

### Documentation Structure

```markdown
# Title

Brief introduction (1-2 sentences).

## What You'll Learn

- Bullet points of key concepts

## Prerequisites

- What you need to know first

## Step-by-Step Guide

### Step 1: ...

Explanation with code example.

## Common Pitfalls

What to avoid and why.

## Next Steps

Where to go from here.
```

## Getting Help

- **Questions**: Open a [Discussion](https://github.com/yourusername/claude-code-testing-pyramid/discussions)
- **Bugs**: Open an [Issue](https://github.com/yourusername/claude-code-testing-pyramid/issues)
- **Security**: Email security@hermetic-technology.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Code of Conduct

Be respectful and professional. We're all here to learn and improve testing practices together.

---

Thank you for contributing! 🎉
