async function test() {
  const url = "https://salt.tikicdn.com/cache/w1200/ts/product/f4/64/09/b39d1b643a60f9518d1a108b35048759.jpg";
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://tiki.vn/",
      }
    });
    console.log(`Status: ${res.status}`);
    console.log(`Type: ${res.headers.get("content-type")}`);
  } catch (e) {
    console.error(e);
  }
}
test();
