import { PrismaClient } from '@prisma/client';
import { PrismaClientSingleton } from '../database/config';
import { User } from '../models/user';

export class ClientRepository {
    
  readonly prisma: PrismaClient;

  constructor() {
    this.prisma = PrismaClientSingleton.getInstance();
  }

  public async createClient(user?: User) {
    try {
      return await this.prisma.client.create({
        data: {
          name: user?.name ?? '',
          users: {
            create: {
              name: user?.name ?? '', 
              email: user?.email ?? '', 
              scope: user?.scope,
              avatarUrl: user?.avatarUrl,
              password: user?.password,
              firstName: user?.firstName,
              lastName: user?.lastName,
              isLoginGoogle: user?.isLoginGoogle ?? false,
            }
          }
        },
      });
    } catch (error) {
      console.log('Failed to create a client', error)
      throw new Error('Failed to create a client');
    }
  }

  public async getUserByEmail(email: string) {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      console.log('Failed to create a client', error)
      throw new Error('Failed to create a client');
    }
  }

  public async getClients() {
    return await this.prisma.client.findMany();
  }

  public async getClientById(id: string) {
    return await this.prisma.client.findUnique({
      where: { id },
    });
  }

  public async getUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  public async updateClient(user?: User) {
    try {
      console.log(user)
      return await this.prisma.user.update({
        data: {
          name: user?.name ?? '', 
          firstName: user?.firstName,
          lastName: user?.lastName,
          client:{
            update:{
              name: user?.name
            }
          }
        },
        where: { id: user?.id } 
        });
    } catch (error) {
      console.log('Failed to create a client', error)
      throw new Error('Failed to create a client');
    }
  }
}
