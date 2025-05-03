import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';  
import { PrismaClientSingleton } from '../database/config';

export class AnalyticsController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = PrismaClientSingleton.getInstance();
  }

  async getUsage(req: Request, res: Response) {
    try { 
      const {userId} = req.headers;
      const usage = await this.prisma.planUsage.findUnique({
        where: { userId: parseInt(userId as string) },
        include: { user: true }
      });
      
      res.json({
        websiteCount: usage?.websiteCount || 0,
        leadCount: usage?.leadCount || 0,
        chatbotUsage: usage?.chatbotInteractionsToday || 0
      });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching usage data' });
    }
  }

  async getKeywords(req: Request, res: Response) {
    try {
      const { domain } = req.params;
      const {userId} = req.headers;
      const website = await this.prisma.website.findFirst({
      });
      
      if (!website) {
        return res.status(404).json({ error: 'Website not found' });
      }

      // Lógica para obtener keywords desde Search Console
      res.json({ keywords: [] });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching keywords' });
    }
  }
}