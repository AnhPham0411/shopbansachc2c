import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../src/app/api/chat/conversations/route';

vi.mock('../src/lib/auth', () => ({ auth: vi.fn() }));

vi.mock('../src/lib/prisma', () => ({
  prisma: {
    conversation: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
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

describe('GET /api/chat/conversations', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return 401 when not authenticated', async () => {
    (auth as any).mockResolvedValue(null);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return conversations for authenticated user', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user1', role: 'USER' } });
    const mockConvs = [
      {
        id: 'conv1',
        buyerId: 'user1',
        sellerId: 'seller1',
        bookId: 'book1',
        lastMessage: 'Xin chào',
        lastMsgAt: new Date(),
        buyer: { id: 'user1', name: 'Buyer' },
        seller: { id: 'seller1', name: 'Seller' },
        book: { id: 'book1', title: 'Test Book', imageUrl: null },
        _count: { messages: 2 },
      },
    ];
    (prisma.conversation.findMany as any).mockResolvedValue(mockConvs);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].id).toBe('conv1');
  });

  it('should return all conversations for ADMIN', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'admin1', role: 'ADMIN' } });
    (prisma.conversation.findMany as any).mockResolvedValue([]);

    await GET();

    // Admin gets empty where clause (all conversations)
    expect(prisma.conversation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} })
    );
  });
});

describe('POST /api/chat/conversations', () => {
  beforeEach(() => vi.clearAllMocks());

  function makeRequest(body: unknown) {
    return new Request('http://localhost/api/chat/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  it('should return 401 when not authenticated', async () => {
    (auth as any).mockResolvedValue(null);

    const res = await POST(makeRequest({ sellerId: 'seller1' }));
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 400 when sellerId is missing', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'buyer1' } });

    const res = await POST(makeRequest({}));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Thiếu sellerId');
  });

  it('should return 400 when user tries to chat with themselves', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user1' } });

    const res = await POST(makeRequest({ sellerId: 'user1' }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Bạn không thể chat với chính mình');
  });

  it('should return existing conversation if already exists', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'buyer1' } });
    const existing = { id: 'conv_old', buyerId: 'buyer1', sellerId: 'seller1', bookId: 'b1' };
    (prisma.conversation.findFirst as any).mockResolvedValue(existing);

    const res = await POST(makeRequest({ sellerId: 'seller1', bookId: 'b1' }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.id).toBe('conv_old');
    expect(prisma.conversation.create).not.toHaveBeenCalled();
  });

  it('should create new conversation when none exists', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'buyer1' } });
    (prisma.conversation.findFirst as any).mockResolvedValue(null);
    const newConv = { id: 'conv_new', buyerId: 'buyer1', sellerId: 'seller1', bookId: null };
    (prisma.conversation.create as any).mockResolvedValue(newConv);

    const res = await POST(makeRequest({ sellerId: 'seller1' }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.id).toBe('conv_new');
    expect(prisma.conversation.create).toHaveBeenCalled();
  });
});
