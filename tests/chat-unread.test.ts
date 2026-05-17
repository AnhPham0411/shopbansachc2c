import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../src/app/api/chat/unread/route';

vi.mock('../src/lib/auth', () => ({ auth: vi.fn() }));

vi.mock('../src/lib/prisma', () => ({
  prisma: {
    message: {
      count: vi.fn(),
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

import { auth } from '../src/lib/auth';
import { prisma } from '../src/lib/prisma';

describe('GET /api/chat/unread', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return count = 0 when not authenticated', async () => {
    (auth as any).mockResolvedValue(null);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.count).toBe(0);
    expect(prisma.message.count).not.toHaveBeenCalled();
  });

  it('should return unread message count for authenticated user', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user1' } });
    (prisma.message.count as any).mockResolvedValue(5);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.count).toBe(5);
    expect(prisma.message.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          senderId: { not: 'user1' },
          isRead: false,
        }),
      })
    );
  });

  it('should return count = 0 when prisma throws error', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user1' } });
    (prisma.message.count as any).mockRejectedValue(new Error('DB Error'));

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.count).toBe(0);
  });
});
