import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../src/app/api/categories/route';
import { prisma } from '../src/lib/prisma';
import { NextResponse } from 'next/server';

// Mock prisma
vi.mock('../src/lib/prisma', () => ({
  prisma: {
    category: {
      findMany: vi.fn(),
    },
  },
}));

// Mock next/server
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
    })),
  },
}));

describe('Categories API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a list of categories sorted by name', async () => {
    const mockCategories = [
      { id: '1', name: 'Art', slug: 'art' },
      { id: '2', name: 'Business', slug: 'business' },
    ];

    (prisma.category.findMany as any).mockResolvedValue(mockCategories);

    const response = await GET();
    const data = await response.json();

    expect(prisma.category.findMany).toHaveBeenCalledWith({
      orderBy: { name: 'asc' },
    });
    expect(data).toEqual(mockCategories);
    expect(response.status).toBe(200);
  });

  it('should return 500 if prisma fails', async () => {
    (prisma.category.findMany as any).mockRejectedValue(new Error('DB Error'));

    const response = await GET();
    const data = await response.json();

    expect(data).toEqual({ error: 'Internal Server Error' });
    expect(response.status).toBe(500);
  });
});
