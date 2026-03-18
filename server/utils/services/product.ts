import {prisma} from "#server/utils/prisma";

export async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      purchaseItems: {
        select: {
          unitPrice: true,
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  return products.map(p => {
    const prices = p.purchaseItems.map(item => item.unitPrice);
    const avgPrice = prices.length > 0
      ? prices.reduce((a, b) => a + b, 0) / prices.length
      : 0;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {purchaseItems, ...productData} = p;

    return {
      ...productData,
      averagePrice: avgPrice,
      purchaseCount: prices.length
    };
  });
}

export async function getProductStats(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      purchaseItems: {
        include: {
          purchase: {
            include: {
              market: true
            }
          }
        },
        orderBy: {
          purchase: {
            date: 'asc'
          }
        }
      }
    }
  });

  if (!product) return null;

  // Process history for charts
  // Group by Market? Or just return flat list and let frontend group?
  // Let's return a structured history:
  // history: { date: string, price: number, marketName: string }[]

  const history = product.purchaseItems.map(item => ({
    date: item.purchase.date,
    price: item.unitPrice,
    marketName: item.purchase.market.name,
    marketId: item.purchase.marketId,
  }));

  // Calculate stats per market
  const marketStats = new Map<string, { min: number, max: number, avg: number, count: number, name: string }>();

  for (const item of product.purchaseItems) {
    const mId = item.purchase.marketId;
    const price = item.unitPrice;

    if (!marketStats.has(mId)) {
      marketStats.set(mId, {
        min: price,
        max: price,
        avg: price,
        count: 1,
        name: item.purchase.market.name
      });
    } else {
      const stats = marketStats.get(mId)!;
      stats.min = Math.min(stats.min, price);
      stats.max = Math.max(stats.max, price);
      stats.avg += price;
      stats.count++;
    }
  }

  // Finalize averages
  const marketsSummary = Array.from(marketStats.values()).map(s => ({
    ...s,
    avg: s.avg / s.count
  }));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {purchaseItems, ...cleanProduct} = product;

  return {
    product: cleanProduct,
    history,
    marketsSummary
  };
}

