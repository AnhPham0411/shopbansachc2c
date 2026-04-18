
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixRoles() {
  try {
    console.log("Starting database cleanup for user roles...");

    // Using queryRaw because the Prisma Client crashes when encountering invalid roles
    // We update anything that is not 'ADMIN' or 'USER' to 'USER'
    const result = await prisma.$executeRaw`
      UPDATE user 
      SET role = 'USER' 
      WHERE role NOT IN ('ADMIN', 'USER') OR role IS NULL OR role = ''
    `;

    console.log(`Successfully updated ${result} users to 'USER' role.`);

    // Double check the results
    const counts: any[] = await prisma.$queryRaw`
      SELECT role, count(*) as count 
      FROM user 
      GROUP BY role
    `;
    console.log("Current user counts by role:", counts);

  } catch (error) {
    console.error("Failed to fix user roles:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixRoles();
