import { Request, Response } from 'express';
import { GoogleApiService } from '../services/GoogleApiService';
import { PrismaClient, Website } from '@prisma/client';  
import { PrismaClientSingleton } from '../database/config';
import { EmailService } from '../services/EmailService';

export class IntegrationController {
  private googleService: GoogleApiService;
  private prisma: PrismaClient;
  private emailService: EmailService;
  
  constructor() {
    this.googleService = new GoogleApiService(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_REDIRECT_URI!
    );
    this.prisma = PrismaClientSingleton.getInstance();
    this.emailService = new EmailService();
  }

  async connectGoogle(req: Request, res: Response) {
    try {
        const { code } = req.query;
        const { googleToken, refreshToken, user: googleUser, expiresAt } = await this.googleService.getTokenUserData(code as string);
        
        let user = await this.prisma.user.findUnique({ where: { email: googleUser.email }});
        let haveWebsite = true;

        // First Google login
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: googleUser.email,
                    googleId: googleUser.id,
                    firstName: googleUser.firstName,
                    lastName: googleUser.lastName,
                    emailVerified: true,
                    planType: 'ESSENTIALS',
                    isProfileComplete: false
                }
            });
            haveWebsite = false;
        }

        const integration = await this.prisma.integration.upsert({
            where: { userId_service: { userId: user?.id ?? 0, service: 'google' } },
            update: { 
                accessToken: googleToken ?? '',
                refreshToken: refreshToken ?? '' ,
                expiresAt: expiresAt ? new Date(expiresAt) : new Date()
            },
            create: {
                userId: user?.id ?? 0,
                service: 'google',
                accessToken: googleToken ?? '',
                refreshToken: refreshToken ?? '',
                expiresAt: expiresAt ? new Date(expiresAt) : new Date()
            }
        });

        if (!haveWebsite) {
            const website = await this.prisma.website.create({
                data: {
                    userId: user?.id ?? 0,
                    domain: '',
                    isVerified: false,
                    verificationCode: '',
                    googleAccessToken: googleToken ?? '',
                    googleRefreshToken: refreshToken ?? '',
                    propertyId: null
                }
            });

            res.status(200).json({ message: 'Google account connected successfully', integration, website, user });
            return;
        }

        const website = await this.prisma.website.findFirst({
            where: { userId: user?.id ?? 0 }
        });

        let updatedWebsite: Website | null = null;
        let verificationData: any;

        if (website) {
          const propertyId = await this.googleService.getGA4PropertyId(website.domain);
          verificationData = await this.googleService.verifyDomain(website.domain);

          updatedWebsite = await this.prisma.website.update({
            where: { id: website.id },
            data: {
              googleAccessToken: googleToken,
              googleRefreshToken: refreshToken,
              verificationCode: verificationData.token,
              propertyId,
              isVerified: false // Reset until new verification
            }
          });
      
          user = await this.prisma.user.update({
            where: { id: user?.id ?? 0 },
            data: {
              isProfileComplete: true
            }
          });
            // 6. Send email with instructions
            // await this.emailService.sendVerificationEmail(
            //     user!.email,
            //     website.domain,
            //     verificationData.dnsRecord
            // );
        }

        res.status(200).json({ message: 'Google account connected successfully', integration, website: updatedWebsite, verificationData, user });
    } catch (error) {
        res.status(500).json({ error: 'Google integration failed' });
    }
  }

  async getIntegrations(req: Request, res: Response) {
    try {
        const {userId} = req.headers;
        const integrations = await this.prisma.integration.findMany({
            where: { userId: parseInt(userId as string) }
        });
        res.json(integrations);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching integrations' });
    }
  }
}