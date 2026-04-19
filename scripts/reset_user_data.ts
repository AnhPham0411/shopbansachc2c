
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const targetEmails = ['admin@gmail.com', 'letuan040702@gmail.com'];
  
  console.log('Finding target users...');
  const users = await prisma.user.findMany({
    where: {
      email: { in: targetEmails }
    }
  });

  const userIds = users.map(u => u.id);
  
  if (userIds.length === 0) {
    console.log('No target users found. Exiting.');
    return;
  }

  console.log(`Found ${userIds.length} users: ${users.map(u => u.name).join(', ')}`);

  // Identify all SubOrders involving these users as seller
  // OR belonging to a MasterOrder where one of these users is the buyer.
  const subOrders = await prisma.subOrder.findMany({
    where: {
      OR: [
        { sellerId: { in: userIds } },
        { masterOrder: { buyerId: { in: userIds } } }
      ]
    },
    select: { id: true, masterOrderId: true }
  });

  const subOrderIds = subOrders.map(so => so.id);
  const masterOrderIds = Array.from(new Set(subOrders.map(so => so.masterOrderId)));

  console.log(`Identified ${subOrderIds.length} sub-orders and ${masterOrderIds.length} master-orders to delete.`);

  if (subOrderIds.length > 0) {
    console.log('Deleting WalletTransactions...');
    await prisma.walletTransaction.deleteMany({
      where: { referenceSubOrderId: { in: subOrderIds } }
    });

    console.log('Deleting Reviews...');
    await prisma.review.deleteMany({
      where: { subOrderId: { in: subOrderIds } }
    });

    console.log('Deleting Disputes...');
    await prisma.dispute.deleteMany({
      where: { subOrderId: { in: subOrderIds } }
    });

    console.log('Deleting OrderItems...');
    await prisma.orderItem.deleteMany({
      where: { subOrderId: { in: subOrderIds } }
    });

    console.log('Deleting SubOrders...');
    await prisma.subOrder.deleteMany({
      where: { id: { in: subOrderIds } }
    });
  }

  if (masterOrderIds.length > 0) {
    console.log('Deleting MasterOrders...');
    await prisma.masterOrder.deleteMany({
      where: { id: { in: masterOrderIds } }
    });
  }

  // Also clear any WalletTransactions directly linked to the user's wallet (e.g. withdrawals)
  const wallets = await prisma.wallet.findMany({
    where: { userId: { in: userIds } }
  });
  const walletIds = wallets.map(w => w.id);

  if (walletIds.length > 0) {
      console.log('Cleaning up remaining WalletTransactions for these users...');
      await prisma.walletTransaction.deleteMany({
          where: { walletId: { in: walletIds } }
      });

      console.log('Resetting Wallet balances to 0...');
      await prisma.wallet.updateMany({
        where: { id: { in: walletIds } },
        data: {
          availableBalance: 0,
          escrowBalance: 0
        }
      });
  }

  console.log('Cleanup complete!');
}

main()
  .catch(e => {
    console.error('Error during cleanup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
