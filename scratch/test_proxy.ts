
import fetch from "node-fetch";

async function testProxy() {
  const imageUrl = "https://salt.tikicdn.com/ts/product/45/3b/03/5c45300f8983a3f0e08f23f668d27a4d.jpg";
  
  try {
    console.log(`Fetching: ${imageUrl}`);
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://tiki.vn/",
      },
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const blob = await response.blob();
      console.log(`Success! Got blob of size: ${blob.size}`);
    } else {
      console.log("Failed to fetch image");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testProxy();
