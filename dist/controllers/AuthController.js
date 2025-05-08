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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const GoogleApiService_1 = require("../services/GoogleApiService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = require("bcrypt");
const client_1 = require("@prisma/client");
const config_1 = require("../database/config");
const EmailService_1 = require("../services/EmailService");
const crypto_1 = __importDefault(require("crypto"));
class AuthController {
    constructor() {
        this.prisma = config_1.PrismaClientSingleton.getInstance();
        this.emailService = new EmailService_1.EmailService();
        this.googleService = new GoogleApiService_1.GoogleApiService(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, firstName, lastName, enterpriseName, domain } = req.body;
                const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
                const [user, website] = yield this.prisma.$transaction([
                    this.prisma.user.create({
                        data: {
                            email,
                            passwordHash: hashedPassword,
                            firstName,
                            lastName,
                            enterpriseName,
                            planType: client_1.PlanType.ESSENTIALS,
                        }
                    }),
                    this.prisma.website.create({
                        data: {
                            domain,
                            verificationCode: `google-${crypto_1.default.randomUUID()}`,
                            user: { connect: { email } }
                        }
                    })
                ]);
                // await this.emailService.sendVerificationEmail(email, domain, website.verificationCode!);
                const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.status(201).json({ user, token, website });
                return;
            }
            catch (error) {
                console.log('error', error);
                res.status(500).json({ error: 'Registration failed' });
                return;
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { user, domain, enterpriseName, firstName, lastName } = req.body;
                const updatedUser = yield this.prisma.user.update({
                    where: { id: parseInt(id) },
                    data: {
                        enterpriseName,
                        firstName,
                        lastName,
                        isProfileComplete: true
                    },
                    include: {
                        websites: true,
                    }
                });
                const { accessToken, refreshToken, expiresAt } = user.integrations[0];
                const tokens = {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    expiry_date: new Date(expiresAt).getTime(),
                };
                this.googleService.setCredentials(tokens);
                const propertyId = yield this.googleService.getGA4PropertyId(domain);
                const verificationData = yield this.googleService.verifyDomain(domain);
                const website = yield this.prisma.website.update({
                    where: { id: updatedUser.websites[0].id },
                    data: {
                        domain,
                        verificationCode: verificationData.token,
                        propertyId,
                        isVerified: false
                    }
                });
                res.status(200).json({ user: updatedUser, website });
            }
            catch (error) {
                res.status(500).json({ error: 'Update profile failed' });
                return;
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req.body;
                const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.json({ user, token });
            }
            catch (error) {
                res.status(500).json({ error: 'Login failed' });
            }
        });
    }
    googleAuth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = this.googleService.getAuthUrl();
                res.status(200).json({ url });
            }
            catch (error) {
                res.status(500).json({ error: 'Google auth failed' });
            }
        });
    }
    googleCallback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { code } = req.query;
                const { user: googleUser } = yield this.googleService.getTokenUserData(code);
                let user = yield this.prisma.user.findUnique({
                    where: { email: (_a = googleUser.email) !== null && _a !== void 0 ? _a : '' }
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
            }
            catch (error) {
                res.status(500).json({ error: 'Google authentication failed' });
            }
        });
    }
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.query;
                const user = yield this.prisma.user.findUnique({
                    where: { email: email }
                });
                res.json(user);
                return user;
            }
            catch (error) {
                res.status(500).json({ error: 'Error fetching profile' });
                return null;
            }
        });
    }
    existUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield this.prisma.user.findUnique({
                    where: { email: email },
                    include: {
                        websites: true,
                        integrations: { where: { service: 'google' } }
                    }
                });
                return user;
            }
            catch (error) {
                console.log('error', error);
                return null;
            }
        });
    }
    userWithIntegrations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.headers.userid);
                const user = yield this.prisma.user.findUnique({
                    where: { id: userId },
                    include: {
                        websites: true,
                        integrations: { where: { service: 'google' } }
                    }
                });
                return user;
            }
            catch (error) {
                console.log('error', error);
                return null;
            }
        });
    }
}
exports.AuthController = AuthController;
