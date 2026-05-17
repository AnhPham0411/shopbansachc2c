import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../src/app/api/checkout/route';

// Mock auth
vi.mock('../src/lib/auth', () => ({
  auth: vi.fn(),
}));

// Mock prisma
vi.mock('../src/lib/prisma', () => ({
  prisma: {
    book: { findUnique: vi.fn() },
    offer: { findFirst: vi.fn() },
    voucher: { findUnique: vi.fn(), update: vi.fn() },
    user: { findFirst: vi.fn() },
    wallet: { upsert: vi.fn(), update: vi.fn() },
    masterOrder: { create: vi.fn() },
    subOrder: { create: vi.fn() },
    walletTransaction: { create: vi.fn() },
    $transaction: vi.fn(),
  },
}));

// Mock next/server
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

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 when not authenticated', async () => {
    (auth as any).mockResolvedValue(null);

    const req = makeRequest({ items: [{ id: 'b1', sellerId: 's1', title: 'Book', quantity: 1, price: 100 }] });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 400 when cart is empty', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'buyer1' } });

    const req = makeRequest({ items: [] });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Giỏ hàng trống');
  });

  it('should return 400 when buyer tries to buy their own book', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'seller1' } });

    const req = makeRequest({
      items: [{ id: 'b1', sellerId: 'seller1', title: 'My Book', quantity: 1, price: 100 }],
      shippingInfo: { name: 'Test', phone: '0123456789', address: 'HN' },
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain('không thể tự mua');
    expect(data.error).toContain('My Book');
  });

  it('should return 400 when book does not exist', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'buyer1' } });
    (prisma.book.findUnique as any).mockResolvedValue(null);
    (prisma.offer.findFirst as any).mockResolvedValue(null);

    const req = makeRequest({
      items: [{ id: 'ghost', sellerId: 'seller1', title: 'Ghost Book', quantity: 1, price: 100 }],
      shippingInfo: { name: 'Test', phone: '0123456789', address: 'HN' },
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain('không tồn tại');
  });

  it('should use accepted offer price instead of book price', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'buyer1' } });
    (prisma.book.findUnique as any).mockResolvedValue({ id: 'b1', price: 100000, stockQuantity: 5 });
    (prisma.offer.findFirst as any).mockResolvedValue({ amount: 80000 });
    (prisma.voucher.findUnique as any).mockResolvedValue(null);
    (prisma.user.findFirst as any).mockResolvedValue({ id: 'admin1' });

    // Mock $transaction to capture what was passed
    (prisma.$transaction as any).mockImplementation(async (fn: any) => {
      const txMock = {
        masterOrder: { create: vi.fn().mockResolvedValue({ id: 'order1' }) },
        subOrder: { create: vi.fn().mockResolvedValue({ id: 'sub1' }) },
        voucher: { findUnique: vi.fn().mockResolvedValue(null), update: vi.fn() },
        user: { findFirst: vi.fn().mockResolvedValue({ id: 'admin1' }) },
        wallet: { upsert: vi.fn().mockResolvedValue({ id: 'w1' }), update: vi.fn() },
        walletTransaction: { create: vi.fn() },
        book: { findUnique: vi.fn().mockResolvedValue({ id: 'b1', stockQuantity: 5 }), update: vi.fn() },
      };
      return fn(txMock);
    });

    const req = makeRequest({
      items: [{ id: 'b1', sellerId: 'seller1', title: 'Book', quantity: 1, price: 100000 }],
      shippingInfo: { name: 'Buyer', phone: '0123456789', address: 'HN' },
    });
    const res = await POST(req);

    // Should reach transaction (offer price used = 80000)
    expect(prisma.$transaction).toHaveBeenCalled();
  });
});
