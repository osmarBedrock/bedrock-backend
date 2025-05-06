import { Request, Response } from 'express';
import { analyticsdata_v1beta } from 'googleapis';

import { Integration, PrismaClient } from '@prisma/client';
import { GoogleApiService } from '../services/GoogleApiService';
import { PrismaClientSingleton } from '../database/config';
import { SearchConsoleQueryRequest } from '../dtos/searchConsole';
import { buildReportBody, getDateRange } from '../helpers/analytics';
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
        const { rowLimit, range, user }: any = req.body;
        const { startDate, endDate } = getDateRange(range);
        const { accessToken, refreshToken, expiresAt } = user.integrations[0];

        const request: SearchConsoleQueryRequest = {
            startDate,
            endDate,
            dimensions: ['query'],
            rowLimit
        };
        const tokens = {
            access_token: accessToken,
            refresh_token: refreshToken,
            expiry_date: new Date(expiresAt).getTime(),
        }
        this.googleService.setCredentials(tokens)
        const data = await this.googleService.getSearchConsoleData(
            user.websites[0].domain,request
        );
        res.json(data);
    } catch (error) {
        res.status(500).json({ error, msg: 'Error fetching website data' });
    }
  }

  async getAnalyticsWebsiteData(req: Request, res: Response) {
    try{
        const { range, metric, dimensions, isRealTime, keepEmptyRows, user } = req.body;
        
        const { startDate, endDate } = getDateRange(range);
        const requestBody: any = buildReportBody({startDate, endDate, range, metrics: metric, dimensions, keepEmptyRows}, isRealTime);
        const { accessToken, refreshToken, expiresAt } = user.integrations[0];
        const tokens = {
            access_token: accessToken,
            refresh_token: refreshToken,
            expiry_date: new Date(expiresAt).getTime(),
        }
        this.googleService.setCredentials(tokens);
        const { propertyId } = user.websites[0];
        const data = await this.googleService.getAnalyticsData(propertyId,requestBody)
        res.status(200).json(data)
    }catch(error){
        res.status(500).json({error, msg: 'Error fetching analytics data'})
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