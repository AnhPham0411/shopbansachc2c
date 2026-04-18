import { PrismaClient } from "@prisma/client";
import * as cheerio from "cheerio";
import "dotenv/config";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function scrapeOreka() {
  console.log("Starting scraper for Oreka.vn...");

  // 1. Find the admin user (the "I" in "books I sell")
  const adminEmail = "admin@gmail.com";
  let seller = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!seller) {
    console.log(`User ${adminEmail} not found. Looking for any SELLER...`);
    seller = await prisma.user.findFirst({
      where: { role: "SELLER" },
    });
  }

  if (!seller) {
    console.error("No SELLER user found in the database. Please create a user with role 'SELLER' first.");
    process.exit(1);
  }

  console.log(`Using seller: ${seller.name} (${seller.id})`);

  // Update seller role if it was ADMIN but used as SELLER
  if (seller.role !== "SELLER") {
    await prisma.user.update({
      where: { id: seller.id },
      data: { role: "SELLER" },
    });
    console.log(`Updated user ${seller.email} role to SELLER.`);
  }

  // 2. Fetch the page
  const url = "https://www.oreka.vn/mua-ban-sach";
  console.log(`Fetching ${url}...`);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    // 3. Parse books
    const books: { title: string; price: number }[] = [];
    
    // Selectors validated by browser subagent
    $('a[class*="ProductCard_wrapContent"]').each((i, el) => {
      if (books.length >= 50) return false;

      const title = $(el).find("h3").text().trim();
      const priceString = $(el).find("p").first().text().trim();
      
      // Clean price: "350.000đ" -> 350000
      const price = parseInt(priceString.replace(/\./g, "").replace("đ", "").replace(/[^0-9]/g, ""), 10);

      if (title && !isNaN(price)) {
        books.push({ title, price });
      }
    });

    console.log(`Found ${books.length} books on the page.`);

    // 4. Batch insert into database
    console.log("Saving to database...");
    let successCount = 0;
    for (const book of books) {
      try {
        await prisma.book.create({
          data: {
            title: book.title,
            price: book.price,
            sellerId: seller.id,
            stockQuantity: Math.floor(Math.random() * 10) + 1, // Random stock 1-10
            condition: "GOOD",
          },
        });
        successCount++;
      } catch (err) {
        console.error(`Failed to save book "${book.title}":`, err);
      }
    }

    console.log(`Import completed: ${successCount} books added.`);

  } catch (error) {
    console.error("Error during scraping:", error);
  } finally {
    await prisma.$disconnect();
  }
}

scrapeOreka();
