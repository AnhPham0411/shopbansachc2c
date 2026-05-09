async function testProxy() {
  const imageUrl = "https://salt.tikicdn.com/cache/w1200/ts/product/f4/64/09/b39d1b643a60f9518d1a108b35048759.jpg";
  const proxyUrl = `http://localhost:3000/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
  
  console.log(`Testing proxy for: ${imageUrl}`);
  try {
    // We can't fetch localhost:3000 from here if the server is separate, 
    // but we can try to fetch the Tiki URL directly with the NEW headers I added to the route.
    const res = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Referer": "https://tiki.vn/",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
      }
    });
    console.log(`Status: ${res.status}`);
    console.log(`Content-Type: ${res.headers.get("content-type")}`);
  } catch (e) {
    console.error(e);
  }
}
testProxy();
