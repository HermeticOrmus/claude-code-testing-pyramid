/**
 * Calculator Unit Tests with Jest
 * Demonstrates: TDD, edge cases, error handling, test organization
 */

import { Calculator } from '../../../src/utils/Calculator';

describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(calculator.add(2, 3)).toBe(5);
    });

    it('should add negative numbers', () => {
      expect(calculator.add(-2, -3)).toBe(-5);
    });

    it('should add positive and negative numbers', () => {
      expect(calculator.add(5, -3)).toBe(2);
    });

    it('should add decimals', () => {
      expect(calculator.add(1.5, 2.3)).toBeCloseTo(3.8);
    });

    it('should add zero', () => {
      expect(calculator.add(5, 0)).toBe(5);
    });
  });

  describe('subtract', () => {
    it('should subtract two positive numbers', () => {
      expect(calculator.subtract(5, 3)).toBe(2);
    });

    it('should subtract negative numbers', () => {
      expect(calculator.subtract(-5, -3)).toBe(-2);
    });

    it('should handle result being negative', () => {
      expect(calculator.subtract(3, 5)).toBe(-2);
    });
  });

  describe('multiply', () => {
    it('should multiply two positive numbers', () => {
      expect(calculator.multiply(3, 4)).toBe(12);
    });

    it('should multiply by zero', () => {
      expect(calculator.multiply(5, 0)).toBe(0);
    });

    it('should multiply negative numbers', () => {
      expect(calculator.multiply(-3, -4)).toBe(12);
    });

    it('should multiply positive and negative', () => {
      expect(calculator.multiply(3, -4)).toBe(-12);
    });
  });

  describe('divide', () => {
    it('should divide two positive numbers', () => {
      expect(calculator.divide(10, 2)).toBe(5);
    });

    it('should handle decimal results', () => {
      expect(calculator.divide(10, 3)).toBeCloseTo(3.333);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => calculator.divide(10, 0)).toThrow('Division by zero');
    });

    it('should divide negative numbers', () => {
      expect(calculator.divide(-10, 2)).toBe(-5);
    });
  });

  describe('power', () => {
    it('should calculate power of positive numbers', () => {
      expect(calculator.power(2, 3)).toBe(8);
    });

    it('should handle power of zero', () => {
      expect(calculator.power(5, 0)).toBe(1);
    });

    it('should handle negative exponents', () => {
      expect(calculator.power(2, -2)).toBe(0.25);
    });

    it('should handle fractional exponents', () => {
      expect(calculator.power(4, 0.5)).toBe(2);
    });
  });

  describe('squareRoot', () => {
    it('should calculate square root of positive number', () => {
      expect(calculator.squareRoot(9)).toBe(3);
    });

    it('should handle square root of zero', () => {
      expect(calculator.squareRoot(0)).toBe(0);
    });

    it('should throw error for negative number', () => {
      expect(() => calculator.squareRoot(-1)).toThrow(
        'Cannot calculate square root of negative number'
      );
    });

    it('should handle decimal results', () => {
      expect(calculator.squareRoot(2)).toBeCloseTo(1.414);
    });
  });

  describe('factorial', () => {
    it('should calculate factorial of positive number', () => {
      expect(calculator.factorial(5)).toBe(120);
    });

    it('should return 1 for factorial of 0', () => {
      expect(calculator.factorial(0)).toBe(1);
    });

    it('should return 1 for factorial of 1', () => {
      expect(calculator.factorial(1)).toBe(1);
    });

    it('should throw error for negative number', () => {
      expect(() => calculator.factorial(-1)).toThrow(
        'Cannot calculate factorial of negative number'
      );
    });

    it('should calculate large factorials', () => {
      expect(calculator.factorial(10)).toBe(3628800);
    });
  });

  describe('percentage', () => {
    it('should calculate percentage', () => {
      expect(calculator.percentage(100, 20)).toBe(20);
    });

    it('should handle decimal percentages', () => {
      expect(calculator.percentage(100, 12.5)).toBe(12.5);
    });

    it('should handle percentage greater than 100', () => {
      expect(calculator.percentage(100, 150)).toBe(150);
    });
  });

  describe('average', () => {
    it('should calculate average of multiple numbers', () => {
      expect(calculator.average([1, 2, 3, 4, 5])).toBe(3);
    });

    it('should calculate average of single number', () => {
      expect(calculator.average([5])).toBe(5);
    });

    it('should throw error for empty array', () => {
      expect(() => calculator.average([])).toThrow('Cannot calculate average of empty array');
    });

    it('should handle negative numbers', () => {
      expect(calculator.average([-1, 0, 1])).toBe(0);
    });

    it('should handle decimal results', () => {
      expect(calculator.average([1, 2, 3])).toBeCloseTo(2);
    });
  });

  describe('median', () => {
    it('should calculate median of odd-length array', () => {
      expect(calculator.median([1, 2, 3, 4, 5])).toBe(3);
    });

    it('should calculate median of even-length array', () => {
      expect(calculator.median([1, 2, 3, 4])).toBe(2.5);
    });

    it('should handle unsorted array', () => {
      expect(calculator.median([5, 1, 3, 2, 4])).toBe(3);
    });

    it('should throw error for empty array', () => {
      expect(() => calculator.median([])).toThrow('Cannot calculate median of empty array');
    });

    it('should handle single element', () => {
      expect(calculator.median([5])).toBe(5);
    });
  });
});
