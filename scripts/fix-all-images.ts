
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const bookImages: Record<string, string> = {
  "Nhà Giả Kim": "https://salt.tikicdn.com/cache/w1200/ts/product/85/51/24/4c11429f1cca16835e872b5d4318af23.jpg",
  "Đắc Nhân Tâm": "https://salt.tikicdn.com/cache/w1200/ts/product/db/09/a5/4892e37b77ddf3b9883e489a2151e7bf.jpg",
  "Mắt Biếc": "https://salt.tikicdn.com/cache/w1200/ts/product/f9/16/7b/c1a9c8c6f609511fdddef5fc4e728d7e.jpg",
  "Cha Giàu Cha Nghèo": "https://salt.tikicdn.com/cache/w1200/ts/product/82/4b/35/cc475d622f717f84cfd6e5a2465842e0.jpg",
  "Cho Tôi Xin Một Vé Đi Tuổi Thơ": "https://salt.tikicdn.com/cache/w1200/ts/product/5e/2e/d3/960309995817a0201192e4119d690a61.jpg",
  "Harry Potter Và Hòn Đá Phù Thủy": "https://salt.tikicdn.com/cache/w1200/ts/product/54/74/4e/de11f0101d91a92e1041935e23652c7c.jpg",
  "Cây Cam Ngọt Của Tôi": "https://salt.tikicdn.com/cache/w1200/ts/product/5e/18/24/2a6154ba08df6ce6161c13f4303fa19e.jpg",
  "Dế Mèn Phiêu Lưu Ký": "https://salt.tikicdn.com/cache/w1200/ts/product/47/54/8e/30bac752bcca2beb34a3522990805aa1.jpg",
  "Thám Tử Lừng Danh Conan - Tập 1": "https://salt.tikicdn.com/cache/w1200/ts/product/e3/47/b5/52a095864ab48b5168e69a258bb16e22.jpg",
  "Doraemon - Tập 1 (Truyện ngắn)": "https://salt.tikicdn.com/cache/w1200/ts/product/28/5f/e3/8627a1395e08a75a49a6de654d2b042f.jpg",
  "SGK Toán 1 - Tập 1 (Kết nối tri thức)": "https://salt.tikicdn.com/cache/w1200/ts/product/79/f1/3c/3624d5af1b562c5e6ba6b3e07de7c7ae.jpg",
  "Muôn Kiếp Nhân Sinh - Tập 1": "https://salt.tikicdn.com/cache/w1200/ts/product/1c/01/ea/6de2d9ffdbc7142e33c387332440adee.jpg",
  "Nhà Đầu Tư Thông Minh": "https://salt.tikicdn.com/cache/w1200/ts/product/8f/cf/60/58181c83ee8614f4955786adfd1711b1.jpg",
  "Quẳng Gánh Lo Đi Và Vui Sống": "https://salt.tikicdn.com/cache/w1200/ts/product/fd/e3/d8/6b2e3e56a1b0a8f8e8e6e5a6b7e6e5a6.jpg",
  "7 Thói Quen Để Thành Đạt": "https://salt.tikicdn.com/cache/w1200/ts/product/f4/64/09/b39d1b643a60f9518d1a108b35048759.jpg",
  "Bí Mật Tư Duy Triệu Phú": "https://salt.tikicdn.com/cache/w1200/ts/product/9e/a3/34/747ac6de3d6faaa7c036eab9b89fa254.jpg",
  "Quốc Gia Khởi Nghiệp": "https://salt.tikicdn.com/cache/w1200/ts/product/18/69/34/4952047a0664f3316f466b043236e3c8.jpg",
  "Chiến Tranh Tiền Tệ": "https://salt.tikicdn.com/cache/w1200/ts/product/42/8e/a8/b37ba7c1b7e93b093cda29cd30ce36cd.jpg",
  "Không Gia Đình": "https://salt.tikicdn.com/cache/w1200/ts/product/2e/f1/b7/c7b6f6d0f66e01a0a5522776c5b05c5c.jpg",
  "Pippi Tất Dài": "https://salt.tikicdn.com/cache/w1200/ts/product/69/83/22/e99120d0c0512164f08049f6c323a237.jpg",
  "Dragon Ball - Tập 1": "https://salt.tikicdn.com/cache/w1200/ts/product/24/85/65/560413e13bde38316081865a82ab8df1.jpg",
  "Naruto - Tập 1": "https://salt.tikicdn.com/cache/w1200/ts/product/00/01/24/e989791444d3202996d9f7962451f5c6.jpg",
  "One Piece - Tập 1": "https://salt.tikicdn.com/cache/w1200/ts/product/0a/02/05/16a86b995ce76bdaa6326388bafe41d1.jpg",
  "SGK Tiếng Việt 1 - Tập 1 (Kết nối tri thức)": "https://salt.tikicdn.com/cache/w1200/ts/product/2b/b9/88/d77b6d6910609658e8066e13f4997148.jpg",
  "SGK Tiếng Anh 6 - Global Success": "https://salt.tikicdn.com/cache/w1200/ts/product/14/0d/16/0034a763a8a816a24683a45c7e37a237.jpg",
  "Ánh Sáng Trong Ta": "https://salt.tikicdn.com/cache/w1200/ts/product/88/cc/70/fd10f3fd1a45ea447d66a8f98b63bea0.jpg",
  "Đọc Vị Bất Kỳ Ai": "https://salt.tikicdn.com/cache/w1200/ts/product/a5/d8/34/841d0260cc305115f6753c25caadd5b0.jpg",
  "Sức Mạnh Của Hiện Tại": "https://salt.tikicdn.com/cache/w1200/ts/product/bf/87/95/c943c5c65ede2780830da4306ed2e029.jpg",
  "Những Cuộc Phiêu Lưu Của Tom Sawyer": "https://salt.tikicdn.com/cache/w1200/media/catalog/product/i/m/img823_7.jpg",
  "SGK Ngữ Văn 10 - Tập 1 (Kết nối tri thức)": "https://salt.tikicdn.com/cache/w1200/ts/product/37/ac/4c/4e607f508d2855e1439d0ce796e0af80.jpg"
};

async function main() {
  console.log("Updating book images in database...");
  
  for (const [title, imageUrl] of Object.entries(bookImages)) {
    const result = await prisma.book.updateMany({
      where: { title },
      data: { imageUrl }
    });
    if (result.count > 0) {
      console.log(`Updated ${result.count} books with title: "${title}"`);
    }
  }
  
  console.log("All books updated successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
