import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new NextResponse("Missing URL", { status: 400 });
  }

  try {
    console.log(`[ProxyImage] Fetching: ${imageUrl}`);
    
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Referer": "https://tiki.vn/",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
      },
      // Increase timeout and handle redirects
      redirect: 'follow',
    });

    if (!response.ok) {
      console.error(`[ProxyImage] Failed to fetch: ${response.status} ${response.statusText} for ${imageUrl}`);
      return new NextResponse(`Failed to fetch image: ${response.statusText}`, { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`[ProxyImage] Successfully fetched ${imageUrl}, size: ${buffer.length}, type: ${contentType}`);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error("[ProxyImage] Error:", error.message || error);
    // Fallback to a placeholder image instead of 500
    return NextResponse.redirect("https://placehold.co/400x600?text=No+Image");
  }
}
