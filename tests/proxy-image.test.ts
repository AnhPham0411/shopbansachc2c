import { describe, it, expect, vi, beforeEach } from 'vitest';

// proxy-image/route.ts dùng `new NextResponse(body, init)` và `NextResponse.redirect(url)`
// nên mock phải là class có constructor, không phải plain object
vi.mock('next/server', () => {
  class MockNextResponse {
    status: number;
    headers: Record<string, string>;
    _body: any;

    constructor(body: any, init?: { status?: number; headers?: Record<string, string> }) {
      this._body = body;
      this.status = init?.status ?? 200;
      this.headers = init?.headers ?? {};
    }

    static json(data: any, init?: { status?: number }) {
      return new MockNextResponse(JSON.stringify(data), { status: init?.status ?? 200 });
    }

    static redirect(url: string) {
      const res = new MockNextResponse(null, { status: 302 });
      res.headers['location'] = url;
      return res;
    }
  }

  class MockNextRequest extends Request {
    constructor(url: string) {
      super(url);
    }
  }

  return {
    NextResponse: MockNextResponse,
    NextRequest: MockNextRequest,
  };
});

import { GET } from '../src/app/api/proxy-image/route';
import { NextRequest } from 'next/server';

describe('GET /api/proxy-image', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return 400 when url param is missing', async () => {
    const req = new NextRequest('http://localhost/api/proxy-image');
    const res = await GET(req as any);

    expect(res.status).toBe(400);
  });

  it('should return 200 with image data when fetch succeeds', async () => {
    const mockImageBuffer = new Uint8Array([137, 80, 78, 71]).buffer; // PNG header
    const mockFetchResponse = {
      ok: true,
      headers: { get: vi.fn().mockReturnValue('image/png') },
      arrayBuffer: vi.fn().mockResolvedValue(mockImageBuffer),
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockFetchResponse));

    const req = new NextRequest('http://localhost/api/proxy-image?url=https://example.com/img.png');
    const res = await GET(req as any);

    expect(res.status).toBe(200);
    expect(res.headers['Content-Type']).toBe('image/png');
    expect(res.headers['Cache-Control']).toBe('public, max-age=31536000, immutable');

    vi.unstubAllGlobals();
  });

  it('should return upstream error status when fetch fails', async () => {
    const mockFetchResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found',
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockFetchResponse));

    const req = new NextRequest('http://localhost/api/proxy-image?url=https://example.com/missing.png');
    const res = await GET(req as any);

    expect(res.status).toBe(404);

    vi.unstubAllGlobals();
  });

  it('should redirect to placeholder when fetch throws runtime error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    const req = new NextRequest('http://localhost/api/proxy-image?url=https://example.com/img.png');
    const res = await GET(req as any);

    // Route catches error and calls NextResponse.redirect(placeholder)
    expect(res.status).toBe(302);
    expect(res.headers['location']).toContain('placehold.co');

    vi.unstubAllGlobals();
  });
});
