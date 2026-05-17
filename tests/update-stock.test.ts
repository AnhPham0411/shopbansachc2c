import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../src/app/api/update-stock/route';

vi.mock('../src/lib/prisma', () => ({
  prisma: {
    book: {
      updateMany: vi.fn(),
    },
  },
}));

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data, init) => ({
      json: async () => data,
      status: init?.status ?? 200,
    })),
  },
}));

import { prisma } from '../src/lib/prisma';

describe('GET /api/update-stock', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return success and updatedCount when update succeeds', async () => {
    (prisma.book.updateMany as any).mockResolvedValue({ count: 25 });

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.updatedCount).toBe(25);
  });

  it('should call updateMany with stockQuantity = 10', async () => {
    (prisma.book.updateMany as any).mockResolvedValue({ count: 10 });

    await GET();

    expect(prisma.book.updateMany).toHaveBeenCalledWith({
      data: { stockQuantity: 10 },
    });
  });

  it('should return 500 and success = false when prisma throws', async () => {
    (prisma.book.updateMany as any).mockRejectedValue(new Error('DB Error'));

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('DB Error');
  });
});
