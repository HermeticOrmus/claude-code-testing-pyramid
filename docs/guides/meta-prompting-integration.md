# Meta-Prompting Framework Integration

This repository includes the [Meta-Prompting Framework](https://github.com/manutej/meta-prompting-framework) as a submodule, enabling AI-powered recursive prompt improvement for generating and refining test examples.

## Overview

The Meta-Prompting Framework provides:

- **Complexity Analysis**: Scores tasks on a 0.0-1.0 scale
- **Strategy Selection**: Chooses optimal approach based on task complexity
- **Context Extraction**: Identifies patterns, constraints, and success indicators
- **Quality Assessment**: Measures output quality with configurable thresholds
- **Recursive Improvement**: Iteratively refines outputs until quality targets are met

## Installation

### 1. Initialize Submodule

If you cloned this repository without submodules:

```bash
git submodule update --init --recursive
```

### 2. Install Dependencies

```bash
# Install meta-prompting dependencies
pip install -e ".[meta-prompting]"

# Or install from the submodule directly
pip install -r tools/meta-prompting-framework/requirements.txt
```

### 3. Configure API Access

```bash
# Copy the example environment file
cp tools/meta-prompting-framework/.env.example tools/meta-prompting-framework/.env

# Edit and add your API key
# ANTHROPIC_API_KEY=your-key-here
```

### 4. Validate Installation

```bash
cd tools/meta-prompting-framework
python3 validate_implementation.py
```

## Usage

### Basic Usage

```python
import sys
sys.path.insert(0, 'tools/meta-prompting-framework')

from meta_prompting_engine.llm_clients.claude import ClaudeClient
from meta_prompting_engine.core import MetaPromptingEngine

# Initialize
llm = ClaudeClient(api_key="your-anthropic-key")
engine = MetaPromptingEngine(llm)

# Generate a test example with meta-prompting
result = engine.execute_with_meta_prompting(
    skill="python-programmer",
    task="Create a comprehensive pytest test suite for a UserService class with CRUD operations",
    max_iterations=3,
    quality_threshold=0.85
)

print(result.final_output)
```

### Use Cases for Testing Pyramid

#### 1. Generate Test Examples

```python
# Generate unit test examples
result = engine.execute_with_meta_prompting(
    skill="test-engineer",
    task="""
    Create a comprehensive Jest unit test for an OrderService that:
    - Has payment and inventory dependencies
    - Uses the saga pattern for compensation
    - Demonstrates mocks, stubs, and spies
    - Follows AAA (Arrange-Act-Assert) pattern
    - Includes error handling tests
    """,
    max_iterations=3,
    quality_threshold=0.90
)
```

#### 2. Improve Documentation

```python
# Enhance existing documentation
result = engine.execute_with_meta_prompting(
    skill="technical-writer",
    task="""
    Improve this testing documentation to:
    - Add more real-world examples
    - Explain WHY, not just WHAT
    - Include common pitfalls
    - Add troubleshooting section

    Current content:
    [paste existing documentation]
    """,
    max_iterations=2,
    quality_threshold=0.85
)
```

#### 3. Generate Integration Tests

```python
# Create database integration tests
result = engine.execute_with_meta_prompting(
    skill="python-programmer",
    task="""
    Create a Testcontainers-based integration test for PostgreSQL that:
    - Uses pytest fixtures
    - Tests CRUD operations on a UserRepository
    - Demonstrates transaction handling
    - Includes cleanup patterns
    - Follows best practices for database testing
    """,
    max_iterations=3,
    quality_threshold=0.88
)
```

#### 4. Create E2E Test Scenarios

```python
# Generate Playwright E2E tests
result = engine.execute_with_meta_prompting(
    skill="test-engineer",
    task="""
    Create a Playwright E2E test for a checkout flow that:
    - Uses Page Object Model
    - Includes explicit waits (no flaky tests)
    - Tests happy path and error scenarios
    - Demonstrates network mocking
    - Is cross-browser compatible
    """,
    max_iterations=3,
    quality_threshold=0.90
)
```

## Framework Structure

```
tools/meta-prompting-framework/
├── meta_prompting_engine/     # Core engine
│   ├── core.py               # Main orchestration
│   ├── complexity_analyzer.py # Task complexity scoring
│   ├── context_extractor.py  # Pattern extraction
│   └── llm_clients/          # LLM integrations
├── agents/                    # Specialized agents
├── skills/                    # Reusable skill definitions
├── meta-prompts/             # Prompt templates
│   └── v2/                   # Latest version
├── examples/                  # Usage demonstrations
└── tests/                     # Test suite
```

## Available Skills

The framework includes pre-built skills relevant to testing:

| Skill | Description |
|-------|-------------|
| `python-programmer` | Python development with best practices |
| `test-engineer` | Test creation and quality assurance |
| `technical-writer` | Documentation and explanation |
| `code-reviewer` | Code review and improvement suggestions |

## Configuration Options

```python
engine.execute_with_meta_prompting(
    skill="...",              # Skill to apply
    task="...",               # Task description
    max_iterations=3,         # Maximum improvement cycles (1-5)
    quality_threshold=0.85,   # Target quality (0.0-1.0)
    early_stopping=True,      # Stop when threshold reached
    verbose=True              # Show iteration progress
)
```

## Quality Scoring

The framework measures output quality across dimensions:

- **Correctness**: Does the code/content work as intended?
- **Completeness**: Are all requirements addressed?
- **Best Practices**: Does it follow established patterns?
- **Documentation**: Is it well-explained?
- **Testability**: Can it be easily tested/verified?

## Complexity Analysis

Tasks are scored on four factors:

| Factor | Weight | Description |
|--------|--------|-------------|
| Word Count | 20% | Longer descriptions = more complex |
| Ambiguity | 30% | Unclear requirements increase complexity |
| Dependencies | 25% | More dependencies = higher complexity |
| Domain Specificity | 25% | Specialized domains are harder |

**Strategy Selection:**
- **Simple (0.0-0.3)**: Direct execution
- **Medium (0.3-0.7)**: Multi-approach synthesis
- **Complex (0.7-1.0)**: Autonomous evolution with multiple iterations

## Best Practices

### 1. Clear Task Descriptions

```python
# Good: Specific and detailed
task = """
Create a pytest test for UserService.create_user() that:
- Tests valid user creation
- Tests duplicate email rejection
- Tests invalid input validation
- Uses mock database
- Follows AAA pattern
"""

# Bad: Vague
task = "Write tests for UserService"
```

### 2. Appropriate Quality Thresholds

| Use Case | Recommended Threshold |
|----------|----------------------|
| Quick prototypes | 0.70 |
| Documentation | 0.80 |
| Production code | 0.85 |
| Critical systems | 0.90+ |

### 3. Iteration Limits

- **Simple tasks**: 1-2 iterations
- **Medium tasks**: 2-3 iterations
- **Complex tasks**: 3-5 iterations

More iterations = better quality but higher API costs.

## Troubleshooting

### API Key Issues

```bash
# Verify API key is set
echo $ANTHROPIC_API_KEY

# Or check .env file
cat tools/meta-prompting-framework/.env
```

### Import Errors

```bash
# Ensure submodule is initialized
git submodule update --init --recursive

# Verify path
python -c "import sys; sys.path.insert(0, 'tools/meta-prompting-framework'); from meta_prompting_engine.core import MetaPromptingEngine; print('OK')"
```

### Quality Threshold Not Reached

If the quality threshold isn't reached after max_iterations:
- Lower the threshold
- Increase max_iterations
- Make the task description more specific
- Break complex tasks into smaller pieces

## Integration with CI/CD

You can use meta-prompting in CI to generate test templates:

```yaml
# .github/workflows/generate-tests.yml
name: Generate Test Templates

on:
  workflow_dispatch:
    inputs:
      task:
        description: 'Test generation task'
        required: true

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive

      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: pip install -e ".[meta-prompting]"

      - name: Generate tests
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          python scripts/generate_tests.py "${{ github.event.inputs.task }}"
```

## Resources

- [Meta-Prompting Framework Repository](https://github.com/manutej/meta-prompting-framework)
- [Framework Documentation](tools/meta-prompting-framework/README.md)
- [Quick Start Guide](tools/meta-prompting-framework/README_QUICKSTART.md)
- [Skills Reference](tools/meta-prompting-framework/SKILLS_FOR_SCALE.md)

## License

The Meta-Prompting Framework is included under its original license. See `tools/meta-prompting-framework/LICENSE` for details.
