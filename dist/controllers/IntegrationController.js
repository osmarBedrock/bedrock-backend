"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationController = void 0;
const GoogleApiService_1 = require("../services/GoogleApiService");
const config_1 = require("../database/config");
const EmailService_1 = require("../services/EmailService");
class IntegrationController {
    constructor() {
        this.googleService = new GoogleApiService_1.GoogleApiService(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
        this.prisma = config_1.PrismaClientSingleton.getInstance();
        this.emailService = new EmailService_1.EmailService();
    }
    connectGoogle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            try {
                const { code } = req.query;
                const { googleToken, refreshToken, user: googleUser, expiresAt } = yield this.googleService.getTokenUserData(code);
                let user = yield this.prisma.user.findUnique({ where: { email: googleUser.email } });
                let haveWebsite = true;
                // First Google login
                if (!user) {
                    user = yield this.prisma.user.create({
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
                const integration = yield this.prisma.integration.upsert({
                    where: { userId_service: { userId: (_a = user === null || user === void 0 ? void 0 : user.id) !== null && _a !== void 0 ? _a : 0, service: 'google' } },
                    update: {
                        accessToken: googleToken !== null && googleToken !== void 0 ? googleToken : '',
                        refreshToken: refreshToken !== null && refreshToken !== void 0 ? refreshToken : '',
                        expiresAt: expiresAt ? new Date(expiresAt) : new Date()
                    },
                    create: {
                        userId: (_b = user === null || user === void 0 ? void 0 : user.id) !== null && _b !== void 0 ? _b : 0,
                        service: 'google',
                        accessToken: googleToken !== null && googleToken !== void 0 ? googleToken : '',
                        refreshToken: refreshToken !== null && refreshToken !== void 0 ? refreshToken : '',
                        expiresAt: expiresAt ? new Date(expiresAt) : new Date()
                    }
                });
                if (!haveWebsite) {
                    const website = yield this.prisma.website.create({
                        data: {
                            userId: (_c = user === null || user === void 0 ? void 0 : user.id) !== null && _c !== void 0 ? _c : 0,
                            domain: '',
                            isVerified: false,
                            verificationCode: '',
                            googleAccessToken: googleToken !== null && googleToken !== void 0 ? googleToken : '',
                            googleRefreshToken: refreshToken !== null && refreshToken !== void 0 ? refreshToken : '',
                            propertyId: null
                        }
                    });
                    res.status(200).json({ message: 'Google account connected successfully', integration, website, user });
                    return;
                }
                const website = yield this.prisma.website.findFirst({
                    where: { userId: (_d = user === null || user === void 0 ? void 0 : user.id) !== null && _d !== void 0 ? _d : 0 }
                });
                let updatedWebsite = null;
                let verificationData;
                if (website) {
                    const propertyId = yield this.googleService.getGA4PropertyId(website.domain);
                    verificationData = yield this.googleService.verifyDomain(website.domain);
                    updatedWebsite = yield this.prisma.website.update({
                        where: { id: website.id },
                        data: {
                            googleAccessToken: googleToken,
                            googleRefreshToken: refreshToken,
                            verificationCode: verificationData.token,
                            propertyId,
                            isVerified: false // Reset until new verification
                        }
                    });
                    user = yield this.prisma.user.update({
                        where: { id: (_e = user === null || user === void 0 ? void 0 : user.id) !== null && _e !== void 0 ? _e : 0 },
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
            }
            catch (error) {
                res.status(500).json({ error: 'Google integration failed' });
            }
        });
    }
    getIntegrations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.headers;
                const integrations = yield this.prisma.integration.findMany({
                    where: { userId: parseInt(userId) }
                });
                res.json(integrations);
            }
            catch (error) {
                res.status(500).json({ error: 'Error fetching integrations' });
            }
        });
    }
}
exports.IntegrationController = IntegrationController;
