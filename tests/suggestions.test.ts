import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../src/app/api/books/suggestions/route';
import { prisma } from '../src/lib/prisma';

// Mock prisma
vi.mock('../src/lib/prisma', () => ({
  prisma: {
    book: {
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

describe('Suggestions API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty array if no query is provided', async () => {
    const request = new Request('http://localhost/api/books/suggestions');
    const response = await GET(request);
    const data = await response.json();

    expect(data).toEqual([]);
    expect(response.status).toBe(200);
    expect(prisma.book.findMany).not.toHaveBeenCalled();
  });

  it('should return books matching the query', async () => {
    const mockBooks = [
      { id: '1', title: 'Clean Code', author: 'Robert Martin', imageUrl: '/img1.jpg' },
    ];
    (prisma.book.findMany as any).mockResolvedValue(mockBooks);

    const request = new Request('http://localhost/api/books/suggestions?q=clean');
    const response = await GET(request);
    const data = await response.json();

    expect(prisma.book.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { title: { contains: 'clean' } },
          { author: { contains: 'clean' } },
        ],
      },
      take: 5,
      select: {
        id: true,
        title: true,
        author: true,
        imageUrl: true,
      },
    });
    expect(data).toEqual(mockBooks);
    expect(response.status).toBe(200);
  });

  it('should return 500 if prisma fails', async () => {
    (prisma.book.findMany as any).mockRejectedValue(new Error('DB Error'));

    const request = new Request('http://localhost/api/books/suggestions?q=error');
    const response = await GET(request);
    const data = await response.json();

    expect(data).toEqual({ error: 'Internal Server Error' });
    expect(response.status).toBe(500);
  });
});
