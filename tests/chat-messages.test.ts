import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../src/app/api/chat/conversations/[id]/messages/route';

vi.mock('../src/lib/auth', () => ({ auth: vi.fn() }));

vi.mock('../src/lib/prisma', () => ({
  prisma: {
    conversation: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    message: {
      findMany: vi.fn(),
      updateMany: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn(),
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

const params = (id: string) => ({ params: Promise.resolve({ id }) });

describe('GET /api/chat/conversations/[id]/messages', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return 401 when not authenticated', async () => {
    (auth as any).mockResolvedValue(null);

    const req = new Request('http://localhost/api/chat/conversations/conv1/messages');
    const res = await GET(req, params('conv1'));
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 404 when conversation not found', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user1' } });
    (prisma.conversation.findUnique as any).mockResolvedValue(null);

    const req = new Request('http://localhost/api/chat/conversations/ghost/messages');
    const res = await GET(req, params('ghost'));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe('Không tìm thấy cuộc hội thoại');
  });

  it('should return 404 when user is not part of conversation', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'outsider' } });
    (prisma.conversation.findUnique as any).mockResolvedValue({
      id: 'conv1',
      buyerId: 'buyer1',
      sellerId: 'seller1',
    });

    const req = new Request('http://localhost/api/chat/conversations/conv1/messages');
    const res = await GET(req, params('conv1'));
    const data = await res.json();

    expect(res.status).toBe(404);
  });

  it('should return messages and mark them as read', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'buyer1' } });
    (prisma.conversation.findUnique as any).mockResolvedValue({
      id: 'conv1',
      buyerId: 'buyer1',
      sellerId: 'seller1',
    });
    const mockMessages = [
      { id: 'msg1', conversationId: 'conv1', senderId: 'seller1', content: 'Hello', isRead: true, createdAt: new Date() },
    ];
    (prisma.message.updateMany as any).mockResolvedValue({ count: 1 });
    (prisma.message.findMany as any).mockResolvedValue(mockMessages);

    const req = new Request('http://localhost/api/chat/conversations/conv1/messages');
    const res = await GET(req, params('conv1'));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(prisma.message.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ conversationId: 'conv1', isRead: false }),
        data: { isRead: true },
      })
    );
  });
});

describe('POST /api/chat/conversations/[id]/messages', () => {
  beforeEach(() => vi.clearAllMocks());

  function makeRequest(body: unknown) {
    return new Request('http://localhost/api/chat/conversations/conv1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  it('should return 401 when not authenticated', async () => {
    (auth as any).mockResolvedValue(null);

    const res = await POST(makeRequest({ content: 'Hello' }), params('conv1'));
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 400 when content is empty', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user1' } });

    const res = await POST(makeRequest({ content: '' }), params('conv1'));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Tin nhắn không được để trống');
  });

  it('should create message and update conversation', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'buyer1' } });
    const newMsg = { id: 'msg_new', conversationId: 'conv1', senderId: 'buyer1', content: 'Sách còn không?' };
    (prisma.$transaction as any).mockImplementation(async (fn: any) => {
      const txMock = {
        message: { create: vi.fn().mockResolvedValue(newMsg) },
        conversation: { update: vi.fn() },
      };
      return fn(txMock);
    });

    const res = await POST(makeRequest({ content: 'Sách còn không?' }), params('conv1'));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.content).toBe('Sách còn không?');
    expect(prisma.$transaction).toHaveBeenCalled();
  });
});
