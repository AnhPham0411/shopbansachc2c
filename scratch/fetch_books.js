const https = require('https');

const url = 'https://tiki.vn/api/v2/products?limit=40&q=sach';

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(data);
      const books = parsedData.data.filter(item => item.thumbnail_url).slice(0, 20).map(item => ({
        title: item.name,
        author: item.authors ? item.authors.map(a => a.name).join(', ') : 'Nhiều tác giả',
        isbn: Math.floor(Math.random() * 10000000000000).toString(),
        price: item.price,
        category: 'LITERATURE', // We'll manually adjust if needed, or leave it
        condition: 'NEW_100',
        description: item.short_description || `Sách ${item.name}`,
        imageUrl: item.thumbnail_url.replace('280x280', 'w1200')
      }));
      console.log(JSON.stringify(books, null, 2));
    } catch (e) {
      console.error("Error parsing JSON:", e);
    }
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
