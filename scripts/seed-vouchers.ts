const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const vouchers = [
    {
      code: "LIBRIS10",
      description: "Giảm 10% cho đơn hàng từ 100k",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderAmount: 100000,
      maxDiscount: 50000,
      usageLimit: 1000,
      isActive: true,
    },
    {
      code: "FREESHIP",
      description: "Giảm 25k cho đơn hàng từ 200k",
      discountType: "FIXED_AMOUNT",
      discountValue: 25000,
      minOrderAmount: 200000,
      isActive: true,
    }
  ];

  for (const v of vouchers) {
    await prisma.voucher.upsert({
      where: { code: v.code },
      update: v,
      create: v,
    });
  }

  console.log("Vouchers seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
