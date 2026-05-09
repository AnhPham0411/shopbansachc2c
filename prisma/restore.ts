import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  const sqlFile = path.join(__dirname, "../bookstore_db.sql");
  if (!fs.existsSync(sqlFile)) {
    console.error(`File không tồn tại: ${sqlFile}`);
    return;
  }

  const sql = fs.readFileSync(sqlFile, "utf-8");

  // Tách các câu lệnh bằng ; và khoảng trắng/xuống dòng
  const statements = sql.split(/;\s*\n/);

  console.log(`Tìm thấy ${statements.length} câu lệnh (sau khi tách bằng dấu chấm phẩy).`);

  await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 0;");
  console.log("Đã tắt kiểm tra khóa ngoại.");

  // Xóa dữ liệu cũ
  const tables = [
    "wallettransaction", "wallet", "notification", "message", 
    "conversation", "favorite", "offer", "orderitem", 
    "pricehistory", "reviewreply", "review", "suborder", 
    "dispute", "masterorder", "bundleitem", "bundle", 
    "book", "user", "voucher"
  ];
  
  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM \`${table}\`;`);
      console.log(`Đã xóa dữ liệu bảng ${table}`);
    } catch (e) {
      console.log(`Không thể xóa bảng ${table} (có thể không tồn tại hoặc lỗi khác)`);
    }
  }

  // Thực thi các câu lệnh INSERT
  let successCount = 0;
  let failCount = 0;

  for (let statement of statements) {
    statement = statement.trim();
    if (!statement) {
      continue;
    }

    // Loại bỏ các dòng chú thích trong câu lệnh
    const lines = statement.split(/\r?\n/);
    const cleanedLines = lines.filter(line => {
      const trimmedLine = line.trim();
      return !trimmedLine.startsWith("--") && !trimmedLine.startsWith("/*") && !trimmedLine.startsWith("#");
    });
    
    const cleanedStatement = cleanedLines.join("\n").trim();

    if (!cleanedStatement) {
      continue;
    }

    if (cleanedStatement.startsWith("INSERT INTO") || cleanedStatement.startsWith("insert into")) {
      try {
        await prisma.$executeRawUnsafe(cleanedStatement);
        successCount++;
      } catch (e) {
        console.error(`Lỗi thực thi lệnh: ${cleanedStatement.substring(0, 100)}...`);
        console.error(e);
        failCount++;
      }
    }
  }

  await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 1;");
  console.log("Đã bật lại kiểm tra khóa ngoại.");
  console.log(`Hoàn thành. Thành công: ${successCount}, Thất bại: ${failCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
