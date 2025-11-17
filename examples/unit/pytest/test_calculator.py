"""
Calculator Tests with Pytest
Demonstrates: Simple tests, fixtures, parametrized testing, error handling
"""

import pytest


class Calculator:
    """Simple calculator for demonstration"""

    def add(self, a: float, b: float) -> float:
        return a + b

    def subtract(self, a: float, b: float) -> float:
        return a - b

    def multiply(self, a: float, b: float) -> float:
        return a * b

    def divide(self, a: float, b: float) -> float:
        if b == 0:
            raise ValueError("Division by zero")
        return a / b

    def power(self, base: float, exponent: float) -> float:
        return base ** exponent


@pytest.fixture
def calculator():
    """Create calculator instance"""
    return Calculator()


class TestBasicOperations:
    """Test basic calculator operations"""

    def test_add_positive_numbers(self, calculator):
        assert calculator.add(2, 3) == 5

    def test_add_negative_numbers(self, calculator):
        assert calculator.add(-2, -3) == -5

    def test_add_mixed_numbers(self, calculator):
        assert calculator.add(5, -3) == 2

    def test_subtract_positive_numbers(self, calculator):
        assert calculator.subtract(5, 3) == 2

    def test_multiply_positive_numbers(self, calculator):
        assert calculator.multiply(3, 4) == 12

    def test_multiply_by_zero(self, calculator):
        assert calculator.multiply(5, 0) == 0

    def test_divide_positive_numbers(self, calculator):
        assert calculator.divide(10, 2) == 5

    def test_divide_with_decimals(self, calculator):
        result = calculator.divide(10, 3)
        assert pytest.approx(result, 0.01) == 3.33

    def test_divide_by_zero_raises_error(self, calculator):
        with pytest.raises(ValueError, match="Division by zero"):
            calculator.divide(10, 0)


class TestParametrizedTests:
    """Demonstrate parametrized testing"""

    @pytest.mark.parametrize("a,b,expected", [
        (2, 3, 5),
        (-1, 1, 0),
        (0, 0, 0),
        (100, 200, 300),
    ])
    def test_add_parametrized(self, calculator, a, b, expected):
        """Test addition with multiple inputs"""
        assert calculator.add(a, b) == expected

    @pytest.mark.parametrize("a,b,expected", [
        (2, 3, 8),
        (5, 2, 25),
        (10, 0, 1),
        (2, -1, 0.5),
    ])
    def test_power_parametrized(self, calculator, a, b, expected):
        """Test power with multiple inputs"""
        assert calculator.power(a, b) == expected

    @pytest.mark.parametrize("operation,a,b,expected", [
        ("add", 1, 2, 3),
        ("subtract", 5, 3, 2),
        ("multiply", 3, 4, 12),
        ("divide", 10, 2, 5),
    ])
    def test_multiple_operations(self, calculator, operation, a, b, expected):
        """Test multiple operations with parametrize"""
        result = getattr(calculator, operation)(a, b)
        assert result == expected


class TestEdgeCases:
    """Test edge cases and boundaries"""

    def test_add_large_numbers(self, calculator):
        assert calculator.add(1e10, 1e10) == 2e10

    def test_multiply_very_small_numbers(self, calculator):
        result = calculator.multiply(1e-10, 1e-10)
        assert pytest.approx(result) == 1e-20

    def test_divide_by_very_small_number(self, calculator):
        result = calculator.divide(1, 1e-10)
        assert result == 1e10
