/* eslint-disable */
// @ts-nocheck
import { BadRequestException } from '@nestjs/common';
import { ParseEnumCaseInsensitivePipe } from '../pipes/parse-enum-case-insensitive.pipe';
import { describe, beforeEach, it, expect } from '@jest/globals';

enum TestEnum {
  VALUE_ONE = 'VALUE_ONE',
  VALUE_TWO = 'VALUE_TWO',
}

describe('ParseEnumCaseInsensitivePipe', () => {
  let pipe: ParseEnumCaseInsensitivePipe;

  beforeEach(() => {
    pipe = new ParseEnumCaseInsensitivePipe(TestEnum, 'TestEnum');
  });

  it('returns undefined for undefined value', () => {
    const result = pipe.transform(undefined, { type: 'query', metatype: String });
    expect(result).toBeUndefined();
  });

  it('returns undefined for null value', () => {
    const result = pipe.transform(null, { type: 'query', metatype: String });
    expect(result).toBeUndefined();
  });

  it('returns undefined for empty string', () => {
    const result = pipe.transform('', { type: 'query', metatype: String });
    expect(result).toBeUndefined();
  });

  it('transforms lowercase to uppercase', () => {
    const result = pipe.transform('value_one', { type: 'query', metatype: String });
    expect(result).toBe('VALUE_ONE');
  });

  it('transforms hyphens to underscores', () => {
    const result = pipe.transform('value-one', { type: 'query', metatype: String });
    expect(result).toBe('VALUE_ONE');
  });

  it('throws BadRequestException for non-string values', () => {
    expect(() => pipe.transform(123, { type: 'query', metatype: Number })).toThrow(BadRequestException);
    expect(() => pipe.transform(true, { type: 'query', metatype: Boolean })).toThrow(BadRequestException);
    expect(() => pipe.transform({}, { type: 'query', metatype: Object })).toThrow(BadRequestException);
  });

  it('throws BadRequestException for invalid enum values', () => {
    expect(() => pipe.transform('INVALID_VALUE', { type: 'query', metatype: String })).toThrow(BadRequestException);
    expect(() => pipe.transform('value-three', { type: 'query', metatype: String })).toThrow(BadRequestException);
  });

  it('returns correct value for valid enum value', () => {
    const result = pipe.transform('VALUE_ONE', { type: 'query', metatype: String });
    expect(result).toBe('VALUE_ONE');
  });

  it('handles mixed case with hyphens', () => {
    const result = pipe.transform('Value-Two', { type: 'query', metatype: String });
    expect(result).toBe('VALUE_TWO');
  });
});
