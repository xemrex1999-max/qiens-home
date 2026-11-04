import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const getPrisma = (): PrismaClient => {
  if (!globalThis.prisma) {
    globalThis.prisma = prismaClientSingleton();
  }
  return globalThis.prisma;
};

const prisma = new Proxy({} as any, {
  get(target, prop) {
    const client = getPrisma();
    // @ts-ignore
    return client[prop];
  }
});

export default prisma;
