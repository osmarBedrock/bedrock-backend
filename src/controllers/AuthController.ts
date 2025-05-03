import { Request, Response } from 'express';
import { GoogleApiService } from '../services/GoogleApiService';
import jwt from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';
import { PlanType, PrismaClient } from '@prisma/client';
import { PrismaClientSingleton } from '../database/config';
import { EmailService } from '../services/EmailService';
import crypto from "crypto"

export class AuthController {
    private googleService: GoogleApiService;
    private prisma: PrismaClient;
    private emailService: EmailService;

    constructor() {
        this.prisma = PrismaClientSingleton.getInstance();
        this.emailService = new EmailService();
        this.googleService = new GoogleApiService(
            process.env.GOOGLE_CLIENT_ID!,
            process.env.GOOGLE_CLIENT_SECRET!,
            process.env.GOOGLE_REDIRECT_URI!
        );
    }

    async register(req: Request, res: Response) {
        try {
            const { email, password, firstName, lastName, enterpriseName, domain } = req.body;

            
            const hashedPassword = await hash(password as string, 10);

            const [user, website] = await this.prisma.$transaction([
                this.prisma.user.create({
                  data: {
                    email,
                    passwordHash: hashedPassword,
                    firstName,
                    lastName,
                    enterpriseName,
                    planType: PlanType.ESSENTIALS,
                  }
                }),
                this.prisma.website.create({
                  data: {
                    domain,
                    verificationCode: `google-${crypto.randomUUID()}`,
                    user: { connect: { email } }
                  }
                })
            ]);
          
            // await this.emailService.sendVerificationEmail(email, domain, website.verificationCode!);

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
            res.status(201).json({ user, token });
            return;
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: 'Registration failed' });
            return;
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { user } = req.body;
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
            res.json({ user, token });
        } catch (error) {
            res.status(500).json({ error: 'Login failed' });
        }
    }

    async googleAuth(req: Request, res: Response) {
        try {
            const url = this.googleService.getAuthUrl();
            res.redirect(url);
        } catch (error) {
            res.status(500).json({ error: 'Google auth failed' });
        }
    }

    async googleCallback(req: Request, res: Response) {
        try {
            const { code } = req.query;
            const { user: googleUser } = await this.googleService.getTokenUserData(code as string);
            
            let user = await this.prisma.user.findUnique({ 
                where: { email: googleUser.email ?? '' } 
            });

            if (!user) {
                // user = await this.prisma.user.create({
                //     data: {
                //         email: googleUser.email ?? '',
                //         firstName: googleUser.firstName ?? '',
                //         lastName: googleUser.LastName ?? '',
                //         emailVerified: true,
                //         planType: 'ESSENTIALS'
                //     }
                // });
            }

            // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
            // res.json({ user, token });
        } catch (error) {
            res.status(500).json({ error: 'Google authentication failed' });
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            const { email } = req.query;

            const user = await this.prisma.user.findUnique({
                where: { email: email as string }
            });
            res.json(user);
            return user;
        } catch (error) {
            res.status(500).json({ error: 'Error fetching profile' });
            return null;
        }
    }

    async existUser(req: Request, res: Response) {
        try {
            const { email } = req.body;

            const user = await this.prisma.user.findUnique({
                where: { email: email as string },
            });
            return user;
        } catch (error) {
            console.log('error', error);
            return null;
        }
    }
    async userWithIntegrations(req: Request, res: Response) {
        try {
            const userId = parseInt(req.headers.userId as string);
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: { 
                    websites: true,
                    integrations: { where: { service: 'google' } }
                }
            });
            return user;
        } catch (error) {
            console.log('error', error);
            return null;
        }
    }
}