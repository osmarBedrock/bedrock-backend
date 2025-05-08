import { PrismaClient, User } from '@prisma/client';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { websites: true, integrations: true }
    });
  }

  async createWithWebsite(userData: any, websiteData: any): Promise<[User, any]> {
    return this.prisma.$transaction([
      this.prisma.user.create({ data: userData }),
      this.prisma.website.create({ data: websiteData })
    ]);
  }
}