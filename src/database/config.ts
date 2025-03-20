import { PrismaClient } from "@prisma/client";

declare global {

  var prisma: PrismaClient;

}

export * from "@prisma/client";

export class PrismaClientSingleton {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!this.instance) {
      this.instance = global.prisma || new PrismaClient();
    }
    // if (process.env.NODE_ENV === "development") global.prisma = prisma;
    return this.instance;
  }
}
