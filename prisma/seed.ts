import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  const email = "admin@gmail.com";
  const password = "12345678";
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  console.log("Seeding admin user...");

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: passwordHash,
      role: "ADMIN",
    },
    create: {
      email,
      name: "System Administrator",
      passwordHash: passwordHash,
      role: "ADMIN",
    },
  });

  // Ensure admin has a wallet
  await prisma.wallet.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      availableBalance: 0,
      escrowBalance: 0,
    },
  });

  console.log("Admin account created/updated successfully:", admin.email);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
