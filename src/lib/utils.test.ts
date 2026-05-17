import { describe, expect, it } from 'vitest';
import { cn, serializePrisma } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges conflicting tailwind classes correctly', () => {
      expect(cn('px-2 py-2', 'px-4')).toBe('py-2 px-4');
    });

    it('ignores falsy conditional classes', () => {
      expect(cn('px-2', true && 'py-2', false && 'm-2', null, undefined)).toBe('px-2 py-2');
    });

    it('supports arrays and object syntax from clsx', () => {
      expect(
        cn(
          ['flex', 'items-center'],
          { 'font-bold': true, hidden: false },
          'rounded-md',
        ),
      ).toBe('flex items-center font-bold rounded-md');
    });

    it('keeps only latest conflicting utility in longer class chains', () => {
      expect(cn('text-sm bg-red-500', 'text-lg', 'bg-blue-500', 'px-4')).toBe('text-lg bg-blue-500 px-4');
    });
  });

  describe('serializePrisma', () => {
    const createDecimalMock = (value: string) => ({
      constructor: { name: 'Decimal' },
      toString: () => value,
      valueOf: () => Number(value),
    });

    it('converts Decimal-like objects to numbers', () => {
      const data = {
        id: 1,
        price: createDecimalMock('10.5'),
      };

      const serialized = serializePrisma(data);

      expect(serialized).toEqual({
        id: 1,
        price: 10.5,
      });
    });

    it('converts nested Decimal-like values inside objects and arrays', () => {
      const data = {
        user: {
          name: 'Test',
          balance: createDecimalMock('100'),
        },
        items: [
          { total: createDecimalMock('25.25') },
          { total: createDecimalMock('9.99') },
        ],
      };

      const result = serializePrisma(data);

      expect(result).toEqual({
        user: {
          name: 'Test',
          balance: 100,
        },
        items: [
          { total: 25.25 },
          { total: 9.99 },
        ],
      });
    });

    it('serializes book detail data shape used by pages in project', () => {
      const createdAt = new Date('2026-05-13T08:00:00.000Z');
      const updatedAt = new Date('2026-05-13T09:30:00.000Z');

      const rawBook = {
        id: 'book-1',
        title: 'Clean Code',
        price: createDecimalMock('150000'),
        seller: {
          name: 'Anh Pham',
          email: 'anh@example.com',
        },
        reviews: [
          {
            id: 'review-1',
            rating: 5,
            createdAt,
            replies: [
              {
                id: 'reply-1',
                createdAt: updatedAt,
                user: {
                  name: 'Admin',
                  role: 'ADMIN',
                },
              },
            ],
          },
        ],
      };

      const result = serializePrisma(rawBook);

      expect(result).toEqual({
        id: 'book-1',
        title: 'Clean Code',
        price: 150000,
        seller: {
          name: 'Anh Pham',
          email: 'anh@example.com',
        },
        reviews: [
          {
            id: 'review-1',
            rating: 5,
            createdAt: createdAt.toISOString(),
            replies: [
              {
                id: 'reply-1',
                createdAt: updatedAt.toISOString(),
                user: {
                  name: 'Admin',
                  role: 'ADMIN',
                },
              },
            ],
          },
        ],
      });
    });

    it('preserves null values while converting Decimal-like values', () => {
      const data = {
        expiryDate: null,
        maxDiscount: null,
        minOrderAmount: createDecimalMock('50000'),
      };

      expect(serializePrisma(data)).toEqual({
        expiryDate: null,
        maxDiscount: null,
        minOrderAmount: 50000,
      });
    });

    it('keeps non-Decimal values unchanged', () => {
      const data = {
        name: 'Book',
        stock: 5,
        tags: ['sale', 'featured'],
        meta: {
          published: true,
        },
      };

      expect(serializePrisma(data)).toEqual(data);
    });

    it('returns arrays with Decimal-like entries converted', () => {
      const data = [
        createDecimalMock('1.5'),
        { price: createDecimalMock('2.75') },
        'text',
        3,
      ];

      expect(serializePrisma(data)).toEqual([1.5, { price: 2.75 }, 'text', 3]);
    });
  });
});
