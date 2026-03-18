import {prisma} from "#server/utils/prisma";

export async function getPurchases() {
  return prisma.purchase.findMany({
    include: {
      market: true,
      _count: {
        select: { items: true }
      }
    },
    orderBy: {
      date: 'desc'
    }
  });
}

export async function getPurchaseById(id: string) {
  return prisma.purchase.findUnique({
    where: { id },
    include: {
      market: true,
      items: {
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      }
    }
  });
}

export async function updatePurchaseItem(itemId: string, data: { quantity?: number, unitPrice?: number }) {
  return prisma.$transaction(async (tx) => {
    // 1. Get current item
    const currentItem = await tx.purchaseItem.findUnique({
      where: { id: itemId }
    });

    if (!currentItem) {
      throw createError({ statusCode: 404, message: "Item not found" });
    }

    // 2. Calculate new values
    const newQuantity = data.quantity ?? currentItem.quantity;
    const newUnitPrice = data.unitPrice ?? currentItem.unitPrice;
    const newTotalPrice = newQuantity * newUnitPrice;

    // 3. Update item
    const updatedItem = await tx.purchaseItem.update({
      where: { id: itemId },
      data: {
        quantity: newQuantity,
        unitPrice: newUnitPrice,
        totalPrice: newTotalPrice
      }
    });

    // 4. Update purchase total
    // Re-sum all items for accuracy
    const aggregations = await tx.purchaseItem.aggregate({
      where: { purchaseId: currentItem.purchaseId },
      _sum: { totalPrice: true }
    });

    await tx.purchase.update({
      where: { id: currentItem.purchaseId },
      data: { total: aggregations._sum.totalPrice || 0 }
    });

    return updatedItem;
  });
}

export async function deletePurchase(id: string) {
  return prisma.purchase.delete({
    where: { id }
  });
}

