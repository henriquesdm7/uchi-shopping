import { prisma } from '../prisma';
import type { CreateShoppingListInput, AddShoppingListItemInput, UpdateShoppingListItemInput } from '#shared/utils/shoppingList.schema';

export class ShoppingListService {
  async getAllLists(userId?: string) {
    return prisma.shoppingList.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { items: true }
        }
      }
    });
  }

  async getListById(id: string) {
    const list = await prisma.shoppingList.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!list) throw createError({ statusCode: 404, statusMessage: 'Lista não encontrada' });

    // Enriquecer cada item com o menor preço histórico, se aplicável
    const enrichedItems = await Promise.all(
      list.items.map(async (item: any) => {
        if (!item.productId) return { ...item, bestPrice: null };

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const bestPriceInfo = await prisma.purchaseItem.findFirst({
          where: { 
            productId: item.productId,
            purchase: {
              date: { gte: thirtyDaysAgo }
            }
          },
          orderBy: { unitPrice: 'asc' },
          include: {
            purchase: {
              include: { market: true }
            }
          }
        });

        return {
          ...item,
          bestPrice: bestPriceInfo ? {
            price: bestPriceInfo.unitPrice,
            marketName: bestPriceInfo.purchase.market.name,
            date: bestPriceInfo.purchase.date
          } : null
        };
      })
    );

    return { ...list, items: enrichedItems };
  }

  async createList(data: CreateShoppingListInput, userId?: string) {
    return prisma.shoppingList.create({
      data: {
        name: data.name,
        userId
      }
    });
  }

  async deleteList(id: string) {
    return prisma.shoppingList.delete({
      where: { id }
    });
  }

  async addItem(listId: string, data: AddShoppingListItemInput) {
    let productId = data.productId;

    // Se o usuário digitou um nome e não forneceu productId, precisamos buscar ou criar o produto
    if (!productId) {
      if (!data.name) throw createError({ statusCode: 400, statusMessage: 'Nome do produto é obrigatório' });
      
      let product = await prisma.product.findUnique({
        where: { name: data.name }
      });

      if (!product) {
        product = await prisma.product.create({
          data: { name: data.name }
        });
      }
      productId = product.id;
    }

    return prisma.shoppingListItem.create({
      data: {
        shoppingListId: listId,
        productId: productId,
        name: data.name,
        quantity: data.quantity ?? 1,
        checked: false
      }
    });
  }

  async updateItem(itemId: string, data: UpdateShoppingListItemInput) {
    return prisma.shoppingListItem.update({
      where: { id: itemId },
      data
    });
  }

  async deleteItem(itemId: string) {
    return prisma.shoppingListItem.delete({
      where: { id: itemId }
    });
  }
}

export const shoppingListService = new ShoppingListService();
