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
exports.WebsiteController = void 0;
const GoogleApiService_1 = require("../services/GoogleApiService");
const config_1 = require("../database/config");
const analytics_1 = require("../helpers/analytics");
class WebsiteController {
    constructor() {
        this.googleService = new GoogleApiService_1.GoogleApiService(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
        this.prisma = config_1.PrismaClientSingleton.getInstance();
    }
    addWebsite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.body.user;
                const googleIntegration = user.integrations.find((i) => i.service === 'google');
                if (!googleIntegration) {
                    return res.status(400).json({ error: 'Google integration required' });
                }
                this.googleService.setCredentials({
                    access_token: googleIntegration.accessToken,
                    refresh_token: googleIntegration.refreshToken
                });
                yield this.googleService.verifyDomain(user.enterprise.domain);
                const website = yield this.prisma.website.create({
                    data: {
                        domain: user.enterprise.domain,
                        userId: user.id,
                        isVerified: true // Ahora se marca como verificado
                    }
                });
                res.status(201).json(website);
            }
            catch (error) {
                res.status(500).json({ error: 'Error adding website' });
            }
        });
    }
    getWebsiteData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rowLimit, range, user } = req.body;
                const { startDate, endDate } = (0, analytics_1.getDateRange)(range);
                const { accessToken, refreshToken, expiresAt } = user.integrations[0];
                const request = {
                    startDate,
                    endDate,
                    dimensions: ['query'],
                    rowLimit
                };
                const tokens = {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    expiry_date: new Date(expiresAt).getTime(),
                };
                this.googleService.setCredentials(tokens);
                const data = yield this.googleService.getSearchConsoleData(user.websites[0].domain, request);
                res.json(data);
            }
            catch (error) {
                res.status(500).json({ error, msg: 'Error fetching website data' });
            }
        });
    }
    getAnalyticsWebsiteData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { range, metric, dimensions, isRealTime, keepEmptyRows, user } = req.body;
                const { startDate, endDate } = (0, analytics_1.getDateRange)(range);
                const requestBody = (0, analytics_1.buildReportBody)({ startDate, endDate, range, metrics: metric, dimensions, keepEmptyRows }, isRealTime);
                const { accessToken, refreshToken, expiresAt } = user.integrations[0];
                const tokens = {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    expiry_date: new Date(expiresAt).getTime(),
                };
                this.googleService.setCredentials(tokens);
                const { propertyId } = user.websites[0];
                const data = yield this.googleService.getAnalyticsData(propertyId, requestBody);
                res.status(200).json(data);
            }
            catch (error) {
                res.status(500).json({ error, msg: 'Error fetching analytics data' });
            }
        });
    }
    getPageSpeed(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { url } = req.query;
                const data = yield this.googleService.getPageSpeedInsights(url);
                res.json(data);
            }
            catch (error) {
                res.status(500).json({ error: 'Error fetching PageSpeed data' });
            }
        });
    }
}
exports.WebsiteController = WebsiteController;
