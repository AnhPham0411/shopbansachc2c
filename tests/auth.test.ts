import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../src/app/api/auth/register/route';
import { prisma } from '../src/lib/prisma';
import { hashPassword } from '../src/lib/auth-utils';

// Mock prisma
vi.mock('../src/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock auth-utils
vi.mock('../src/lib/auth-utils', () => ({
  hashPassword: vi.fn(),
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

describe('Auth Register API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if missing fields', async () => {
    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Vui lòng nhập đầy đủ thông tin');
  });

  it('should return 400 if email already exists', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ id: '1' });

    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'existing@example.com', password: '123', name: 'Test' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Email này đã được sử dụng');
  });

  it('should create user and return 201 on success', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(null);
    (hashPassword as any).mockResolvedValue('hashed_pass');
    (prisma.user.create as any).mockResolvedValue({ id: 'new_user_id' });

    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'new@example.com', password: 'password123', name: 'New User' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: 'new@example.com',
        name: 'New User',
        passwordHash: 'hashed_pass',
        role: 'USER',
        wallets: {
          create: {
            availableBalance: 0,
            escrowBalance: 0,
          },
        },
      },
    });
    expect(response.status).toBe(201);
    expect(data.message).toBe('Đăng ký thành công');
    expect(data.userId).toBe('new_user_id');
  });

  it('should return 500 if prisma fails', async () => {
    (prisma.user.findUnique as any).mockRejectedValue(new Error('DB Error'));

    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'error@example.com', password: '123', name: 'Test' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
  });
});
