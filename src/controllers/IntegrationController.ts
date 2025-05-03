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
        const { googleToken, refreshToken, user: googleUser } = await this.googleService.getTokenUserData(code as string);
        
        let user = await this.prisma.user.findUnique({ where: { email: googleUser.email }});

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
        }

        const integration = await this.prisma.integration.upsert({
            where: { userId_service: { userId: user?.id ?? 0, service: 'google' } },
            update: { 
                accessToken: googleToken ?? '',
                refreshToken: refreshToken ?? '' ,
                expiresAt: new Date(Date.now() + 3600 * 1000)
            },
            create: {
                userId: user?.id ?? 0,
                service: 'google',
                accessToken: googleToken ?? '',
                refreshToken: refreshToken ?? '',
                expiresAt: new Date(Date.now() + 3600 * 1000)
            }
        });

        if (!user.isProfileComplete) {
            // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '10m' });
            // res.redirect(`/complete-profile?token=${token}`);
            return;
        }
      
        const website = await this.prisma.website.findFirst({
            where: { userId: user?.id ?? 0 }
        });

        let updatedWebsite: Website | null = null;
        let verificationData: any;

        if (website) {
            verificationData = await this.googleService.verifyDomain(website.domain);

            updatedWebsite = await this.prisma.website.update({
              where: { id: website.id },
              data: {
                googleAccessToken: googleToken,
                googleRefreshToken: refreshToken,
                verificationCode: verificationData.dnsRecord.split('=')[1],
                isVerified: false // Resetear hasta nueva verificación
              }
            });
      
            // 6. Enviar email con instrucciones
            // await this.emailService.sendVerificationEmail(
            //     user!.email,
            //     website.domain,
            //     verificationData.dnsRecord
            // );
        }
      
        res.status(200).json({ message: 'Google account connected successfully', integration, website, updatedWebsite, verificationData });
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