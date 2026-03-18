import {CreateMarketInput} from "#shared/utils/market.schema";
import {prisma} from "#server/utils/prisma";

export async function createMarket(input: CreateMarketInput) {
  return prisma.market.create({
    data: input,
  });
}

export async function getMarkets() {
  return prisma.market.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getMarketById(id: string) {
  return prisma.market.findUnique({
    where: {
      id,
    }
  });
}

export async function updateMarket(id: string, input: Partial<CreateMarketInput>) {
  return prisma.market.update({
    where: {
      id,
    },
    data: input,
  });
}

export async function deleteMarket(id: string) {
  return prisma.market.delete({
    where: {
      id,
    }
  });
}

