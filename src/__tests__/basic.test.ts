/**
 * Basic test to verify Jest setup works
 */

import { describe, test, expect } from '@jest/globals';

describe('Basic Setup', () => {
  test('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  test('should have environment setup', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});