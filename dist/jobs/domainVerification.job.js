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
exports.DomainVerificationJob = void 0;
// src/jobs/domainVerification.job.ts
const node_cron_1 = __importDefault(require("node-cron"));
const GoogleApiService_1 = require("../services/GoogleApiService");
class DomainVerificationJob {
    constructor() {
        this.googleService = new GoogleApiService_1.GoogleApiService(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
    }
    start() {
        // Programa la verificación diaria a las 3 AM
        node_cron_1.default.schedule('0 3 * * *', () => __awaiter(this, void 0, void 0, function* () {
            console.log('Iniciando verificación de dominios...');
            try {
                yield this.verifyUnconfirmedDomains();
            }
            catch (error) {
                console.error('Error en el cron job:', error);
            }
        }));
    }
    verifyUnconfirmedDomains() {
        return __awaiter(this, void 0, void 0, function* () {
            const websites = yield prisma.website.findMany({
                where: { isVerified: false },
                include: {
                    user: {
                        include: {
                            integrations: {
                                where: { service: 'google' }
                            }
                        }
                    }
                }
            });
            for (const website of websites) {
                yield this.processWebsiteVerification(website);
            }
        });
    }
    processWebsiteVerification(website) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const integration = website.user.integrations[0];
                if (!integration) {
                    console.warn(`Usuario ${website.user.email} no tiene integración Google`);
                    return;
                }
                // Configurar credenciales
                this.googleService.setCredentials({
                    access_token: integration.accessToken,
                    refresh_token: integration.refreshToken
                });
                // Verificar estado del sitio
                const isVerified = yield this.checkDomainVerification(website.domain);
                if (isVerified) {
                    // await this.handleVerifiedDomain(website);
                }
            }
            catch (error) {
                yield this.handleVerificationError(error, website);
            }
        });
    }
    checkDomainVerification(domain) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const siteInfo = yield this.googleService.getSearchConsoleSite(domain);
                return siteInfo.isVerified;
            }
            catch (error) {
                if (error.code === 404)
                    return false;
                throw error;
            }
        });
    }
    // private async handleVerifiedDomain(website: any): Promise<void> {
    //   await prisma.website.update({
    //     where: { id: website.id },
    //     data: { isVerified: true }
    //   });
    //   await this.emailService.sendConfirmationEmail(
    //     website.user.email,
    //     website.domain
    //   );
    //   console.log(`Dominio ${website.domain} verificado correctamente`);
    // }
    handleVerificationError(error, website) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.error(`Error verificando ${website.domain}:`, error.message);
            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                console.log('Intentando refrescar token...');
                yield this.handleTokenRefresh(website.user.id);
            }
        });
    }
    handleTokenRefresh(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.googleService.refreshAndUpdateTokens(userId);
                console.log('Token actualizado correctamente');
            }
            catch (refreshError) {
                console.error('Error refrescando token:', refreshError);
            }
        });
    }
}
exports.DomainVerificationJob = DomainVerificationJob;
