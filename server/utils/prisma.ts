import {PrismaClient} from "#server/generated/prisma/client";
import {PrismaMariaDb} from "@prisma/adapter-mariadb";

const prismaClientSingleton = () => {
  const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT as number | undefined,
    connectionLimit: 5,
    allowPublicKeyRetrieval: true,
  });
  return new PrismaClient({
    adapter: adapter,
    // log: ['query', 'info', 'error', 'warn']
  });
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export {
  prisma
}
