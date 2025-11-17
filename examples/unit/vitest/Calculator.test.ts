/**
 * Calculator Tests with Vitest
 * Demonstrates: Vitest test structure, matchers, benchmarking
 */

import { describe, it, expect, beforeEach, bench } from 'vitest';
import { Calculator } from '../../../src/utils/Calculator';

describe('Calculator with Vitest', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('basic operations', () => {
    it('should add numbers', () => {
      expect(calculator.add(2, 3)).toBe(5);
      expect(calculator.add(-1, 1)).toBe(0);
    });

    it('should subtract numbers', () => {
      expect(calculator.subtract(5, 3)).toBe(2);
      expect(calculator.subtract(3, 5)).toBe(-2);
    });

    it('should multiply numbers', () => {
      expect(calculator.multiply(3, 4)).toBe(12);
      expect(calculator.multiply(-3, 4)).toBe(-12);
    });

    it('should divide numbers', () => {
      expect(calculator.divide(10, 2)).toBe(5);
      expect(calculator.divide(10, 3)).toBeCloseTo(3.333, 2);
    });

    it('should throw error on division by zero', () => {
      expect(() => calculator.divide(10, 0)).toThrow('Division by zero');
    });
  });

  describe('advanced operations', () => {
    it('should calculate power', () => {
      expect(calculator.power(2, 3)).toBe(8);
      expect(calculator.power(5, 0)).toBe(1);
    });

    it('should calculate square root', () => {
      expect(calculator.squareRoot(9)).toBe(3);
      expect(calculator.squareRoot(0)).toBe(0);
    });

    it('should throw error for negative square root', () => {
      expect(() => calculator.squareRoot(-1)).toThrow(
        'Cannot calculate square root of negative number'
      );
    });

    it('should calculate factorial', () => {
      expect(calculator.factorial(5)).toBe(120);
      expect(calculator.factorial(0)).toBe(1);
    });
  });

  describe('array operations', () => {
    it('should calculate average', () => {
      expect(calculator.average([1, 2, 3, 4, 5])).toBe(3);
      expect(calculator.average([10])).toBe(10);
    });

    it('should throw error for empty array average', () => {
      expect(() => calculator.average([])).toThrow(
        'Cannot calculate average of empty array'
      );
    });

    it('should calculate median', () => {
      expect(calculator.median([1, 2, 3, 4, 5])).toBe(3);
      expect(calculator.median([1, 2, 3, 4])).toBe(2.5);
    });
  });

  /**
   * Vitest Benchmark Feature
   * Benchmark tests to measure performance
   */
  describe('performance benchmarks', () => {
    // Benchmark: Compare performance of different approaches
    bench('factorial recursive', () => {
      calculator.factorial(10);
    });

    bench('average calculation', () => {
      calculator.average(Array.from({ length: 100 }, (_, i) => i));
    });
  });
});
