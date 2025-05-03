import { Request, Response } from 'express';
import { GoogleApiService } from '../services/GoogleApiService';
import { Integration, PrismaClient } from '@prisma/client';
import { PrismaClientSingleton } from '../database/config';
import { SearchConsoleQueryRequest } from '../dtos/searchConsole';
import { User } from '@prisma/client';
export class WebsiteController {
  private googleService: GoogleApiService;
  private prisma: PrismaClient;

  constructor() {
    this.googleService = new GoogleApiService(
        process.env.GOOGLE_CLIENT_ID!,
        process.env.GOOGLE_CLIENT_SECRET!,
        process.env.GOOGLE_REDIRECT_URI!
    );
    this.prisma = PrismaClientSingleton.getInstance();
  }

  async addWebsite(req: Request, res: Response) {
    try {
        const user = req.body.user;

        const googleIntegration = user.integrations.find((i: Integration) => i.service === 'google');

        if (!googleIntegration) {
            return res.status(400).json({ error: 'Google integration required' });
        }

        this.googleService.setCredentials({
            access_token: googleIntegration.accessToken,
            refresh_token: googleIntegration.refreshToken
        });

        await this.googleService.verifyDomain(user.enterprise.domain);

        const website = await this.prisma.website.create({
            data: {
                domain: user.enterprise.domain,
                userId: user.id,
                isVerified: true // Ahora se marca como verificado
            }
        });

        res.status(201).json(website);
    } catch (error) {
        res.status(500).json({ error: 'Error adding website' });
    }
  }

  async getWebsiteData(req: Request, res: Response) {
    try {
        const { domain } = req.params;
        const request: SearchConsoleQueryRequest = {
            startDate: '30daysAgo',
            endDate: 'today',
            dimensions: ['query'],
            rowLimit: 100
        };
        const data = await this.googleService.getSearchConsoleData(
            domain,request
        );
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching website data' });
    }
  }

  async getPageSpeed(req: Request, res: Response) {
    try {
        const { url } = req.query;
        const data = await this.googleService.getPageSpeedInsights(url as string);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching PageSpeed data' });
    }
  }
}