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
exports.GoogleApiService = void 0;
const googleapis_1 = require("googleapis");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ReportBodyOptions_1 = require("../constants/ReportBodyOptions");
const config_1 = require("../database/config");
class GoogleApiService {
    constructor(clientId, clientSecret, redirectUri) {
        this.prisma = config_1.PrismaClientSingleton.getInstance();
        this.oAuth2Client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, redirectUri);
        this.pageSpeed = googleapis_1.google.pagespeedonline("v5");
        this.searchConsole = googleapis_1.google.searchconsole({ version: "v1", auth: this.oAuth2Client });
        this.analyticsData = googleapis_1.google.analyticsdata({ version: 'v1beta', auth: this.oAuth2Client });
        this.PAGESPEED_API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY || '';
        this.siteVerification = googleapis_1.google.siteVerification({ version: 'v1', auth: this.oAuth2Client });
        this.analyticsAdmin = googleapis_1.google.analyticsadmin({ version: 'v1alpha', auth: this.oAuth2Client });
    }
    getAuthUrl() {
        const scopes = [
            "openid",
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            "https://www.googleapis.com/auth/webmasters",
            "https://www.googleapis.com/auth/webmasters.readonly",
            "https://www.googleapis.com/auth/analytics",
            "https://www.googleapis.com/auth/analytics.edit",
            "https://www.googleapis.com/auth/analytics.readonly",
            "https://www.googleapis.com/auth/analytics.manage.users",
            "https://www.googleapis.com/auth/analytics.manage.users.readonly",
            'https://www.googleapis.com/auth/siteverification'
        ];
        return this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: scopes
        });
    }
    setCredentials(tokens) {
        this.oAuth2Client.setCredentials(tokens);
        this.searchConsole = googleapis_1.google.searchconsole({
            version: 'v1',
            auth: this.oAuth2Client
        });
        this.analyticsData = googleapis_1.google.analyticsdata({
            version: 'v1beta',
            auth: this.oAuth2Client
        });
        this.siteVerification = googleapis_1.google.siteVerification({
            version: 'v1',
            auth: this.oAuth2Client
        });
        this.analyticsAdmin = googleapis_1.google.analyticsadmin({
            version: 'v1alpha', auth: this.oAuth2Client
        });
    }
    getToken(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tokens } = yield this.oAuth2Client.getToken(code);
            this.oAuth2Client.setCredentials(tokens);
            const oauth2 = googleapis_1.google.oauth2({
                auth: this.oAuth2Client,
                version: 'v2'
            });
            const userInfo = yield oauth2.userinfo.get();
            // Get associated Analytics properties
            const analytics = googleapis_1.google.analytics('v3');
            const properties = yield analytics.management.webproperties.list({
                accountId: '~all',
                auth: this.oAuth2Client
            });
            return {
                tokens,
                userInfo: userInfo.data,
                analyticsProperties: properties.data.items
            };
        });
    }
    getAnalyticsDataV4(propertyId, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const response = yield this.analyticsData.properties.runReport({
                    property: `properties/${propertyId}`,
                    requestBody: {
                        dateRanges: requestBody.dateRanges,
                        dimensions: requestBody.dimensions,
                        metrics: requestBody.metrics,
                        dimensionFilter: requestBody.dimensionFilter,
                        metricFilter: requestBody.metricFilter,
                        limit: (_a = requestBody.limit) === null || _a === void 0 ? void 0 : _a.toString(),
                        offset: (_b = requestBody.offset) === null || _b === void 0 ? void 0 : _b.toString(),
                        orderBys: requestBody.orderBys,
                        keepEmptyRows: requestBody.keepEmptyRows
                    }
                });
                return this.transformAnalyticsData(response.data);
            }
            catch (error) {
                console.error('Analytics API Error:', error.message);
                throw new Error('Failed to fetch analytics data');
            }
        });
    }
    transformAnalyticsData(data) {
        var _a, _b, _c, _d;
        return {
            rows: ((_a = data.rows) === null || _a === void 0 ? void 0 : _a.map((row) => {
                var _a, _b;
                return ({
                    dimensionValues: ((_a = row.dimensionValues) === null || _a === void 0 ? void 0 : _a.map((d) => d.value)) || [],
                    metricValues: ((_b = row.metricValues) === null || _b === void 0 ? void 0 : _b.map((m) => m.value)) || []
                });
            })) || [],
            totals: ((_d = (_c = (_b = data.totals) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.metricValues) === null || _d === void 0 ? void 0 : _d.map((m) => m.value)) || [],
            rowCount: data.rowCount || 0
        };
    }
    refreshAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { credentials } = yield this.oAuth2Client.refreshAccessToken();
                return {
                    accessToken: credentials.access_token || '',
                    expireTime: credentials.expiry_date ?
                        Math.round((credentials.expiry_date - Date.now()) / 1000).toString() : '3600'
                };
            }
            catch (error) {
                console.error('Token Refresh Error:', error.message);
                throw new Error('Failed to refresh access token');
            }
        });
    }
    revokeToken(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.oAuth2Client.revokeToken(accessToken);
                console.log('Token revoked successfully');
            }
            catch (error) {
                console.error('Token Revocation Error:', error.message);
                throw new Error('Failed to revoke token');
            }
        });
    }
    getAnalyticsDataV3(viewId_1) {
        return __awaiter(this, arguments, void 0, function* (viewId, data = ReportBodyOptions_1.reportWithOrderBy, isRealTime = false) {
            try {
                const url = `https://analyticsdata.googleapis.com/v1beta/properties/${viewId}:${isRealTime ? 'runRealtimeReport' : 'runReport'}`;
                const response = yield this.oAuth2Client.request({
                    url,
                    method: 'POST',
                    data,
                });
                return response.data;
            }
            catch (error) {
                console.error('Error fetching Analytics data:', error);
                throw new Error('Failed to fetch Analytics data');
            }
        });
    }
    getSearchConsoleData(siteUrl, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.searchConsole.searchanalytics.query({
                    siteUrl,
                    requestBody: {
                        startDate: request.startDate,
                        endDate: request.endDate,
                        dimensions: request.dimensions,
                        dimensionFilterGroups: request.filters,
                        rowLimit: request.rowLimit,
                        aggregationType: request.aggregationType
                    }
                });
                return this.transformSearchConsoleData(response.data);
            }
            catch (error) {
                console.error('Search Console API Error:', error.message);
                throw new Error('Failed to fetch Search Console data');
            }
        });
    }
    transformSearchConsoleData(data) {
        var _a;
        return {
            rows: ((_a = data.rows) === null || _a === void 0 ? void 0 : _a.map((row) => ({
                keys: row.keys,
                clicks: row.clicks,
                impressions: row.impressions,
                ctr: row.ctr,
                position: row.position
            }))) || [],
            aggregationType: data.aggregationType
        };
    }
    getAnalyticsData(propertyId, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('propertyId', propertyId);
                // Validar propertyId
                if (!propertyId.match(/^\d+$/)) {
                    throw new Error("Invalid propertyId format. It must be numeric.");
                }
                console.log('propertyId,requestBody', propertyId, requestBody);
                const response = yield this.analyticsData.properties.runReport({
                    property: `properties/${propertyId}`,
                    requestBody
                });
                console.log('API response:', JSON.stringify(response.data, null, 2));
                return response.data;
            }
            catch (error) {
                console.error('Analytics Data API Error:', error.message, error);
                throw new Error(error);
            }
        });
    }
    getTokenUserData(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tokens } = yield this.oAuth2Client.getToken(code);
                this.setCredentials(tokens);
                // Get basic user info
                const oauth2 = googleapis_1.google.oauth2({ version: 'v2', auth: this.oAuth2Client });
                const userInfo = yield oauth2.userinfo.get();
                // Additional verification for companies
                if (!userInfo.data.hd) {
                    throw new Error('Corporate account required');
                }
                const user = {
                    email: userInfo.data.email,
                    name: userInfo.data.name,
                    picture: userInfo.data.picture,
                    firstName: userInfo.data.given_name,
                    lastName: userInfo.data.family_name,
                    id: userInfo.data.id
                };
                // Generate token JWT
                const token = jsonwebtoken_1.default.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
                return { user, token, googleToken: tokens.access_token, refreshToken: tokens.refresh_token, expiresAt: tokens.expiry_date };
            }
            catch (error) {
                console.error(error);
                throw new Error('Failed to authenticate with Google');
            }
        });
    }
    verifyDomain(rawDomain) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                // 1. Normalize domain
                const domain = rawDomain
                    .replace(/^(https?:\/\/)?/i, '') // Delete protocol
                    .replace(/\/+$/i, '') // Delete final slashes
                    .toLowerCase(); // Force lowercase
                // 2. Validate domain format  
                if (!/^(?!-)[a-z0-9-]{1,63}(\.[a-z]{2,})+$/.test(domain)) {
                    throw new Error(`Invalid domain format: ${domain}`);
                }
                // 3. Register domain in Search Console
                yield this.searchConsole.sites.add({
                    siteUrl: `sc-domain:${domain}`,
                    auth: this.oAuth2Client // Pass explicit authentication
                });
                const requestBody = {
                    site: {
                        identifier: domain,
                        type: 'INET_DOMAIN'
                    },
                    verificationMethod: 'DNS' // Correctly located in the requestBody
                };
                // 4. Get DNS verification token
                const verification = yield this.siteVerification.webResource.getToken({
                    requestBody, // Pass the entire body
                    auth: this.oAuth2Client // Required authentication
                });
                // 5. Return data for DNS configuration
                return {
                    dnsRecord: `TXT ${domain} "google-site-verification=${verification.data.token}"`,
                    verificationUrl: `https://search.google.com/search-console?resource_id=sc-domain:${domain}`,
                    token: verification.data.token
                };
            }
            catch (error) {
                console.error('Verification error:', {
                    domain: rawDomain,
                    code: error.code,
                    errors: (_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.errors
                });
                throw new Error(`Error ${error.code}: ${error.message}`);
            }
        });
    }
    getSearchConsoleSite(siteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const response = yield this.searchConsole.sites.get({ siteUrl });
                return {
                    isVerified: ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.siteUrl) === null || _b === void 0 ? void 0 : _b.includes('sc-domain:')) || false
                };
            }
            catch (error) {
                if (error.code === 404)
                    return { isVerified: false };
                throw error;
            }
        });
    }
    refreshAndUpdateTokens(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const integration = yield this.prisma.integration.findUnique({
                where: { userId_service: { userId: parseInt(userId), service: 'google' } }
            });
            if (!integration)
                throw new Error('No Google integration found');
            const credentials = yield this.refreshAccessToken();
            yield this.prisma.integration.update({
                where: { id: integration.id },
                data: {
                    accessToken: credentials.accessToken,
                    expiresAt: new Date(Date.now() + (Number(credentials.expireTime) || 3600 * 1000))
                }
            });
            return credentials;
        });
    }
    getGA4PropertyId(domain) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // 1. Normalize domain
                const cleanDomain = this.normalizeDomain(domain);
                // 2. List all GA4 properties of the user
                const { data } = yield this.analyticsAdmin.accountSummaries.list();
                // 3. Search for the property that matches the domain
                const allProperties = ((_a = data.accountSummaries) === null || _a === void 0 ? void 0 : _a.flatMap(acc => acc.propertySummaries || [])) || [];
                console.log('allProperties', cleanDomain);
                const matchedProperty = allProperties.find(p => {
                    var _a;
                    const displayName = ((_a = p.displayName) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
                    return displayName.includes(cleanDomain) ||
                        cleanDomain.includes(displayName);
                });
                console.log('matchedProperty', matchedProperty);
                if (!(matchedProperty === null || matchedProperty === void 0 ? void 0 : matchedProperty.property)) {
                    throw new Error(`No GA4 property found for ${cleanDomain}`);
                }
                return matchedProperty.property.replace('properties/', '');
            }
            catch (error) {
                console.error('Error getting Property ID:', error);
                throw new Error('Failed to get Analytics property ID');
            }
        });
    }
    extractDomainFromDisplayName(displayName) {
        // Extract possible domains from the displayName
        const domainMatch = displayName.match(/(?:https?:\/\/)?([a-z0-9-]+\.[a-z]{2,})/i);
        console.log('domainMatch', domainMatch, displayName);
        return domainMatch ? this.normalizeDomain(domainMatch[1]) : '';
    }
    normalizeDomain(domain) {
        return domain
            .replace(/^(https?:\/\/)?/i, '')
            .replace(/\/+$/i, '')
            .toLowerCase();
    }
    getPageSpeedInsights(url_1) {
        return __awaiter(this, arguments, void 0, function* (url, strategy = 'mobile') {
            try {
                const { data } = yield this.pageSpeed.pagespeedapi.runpagespeed({
                    url,
                    strategy,
                    category: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
                    key: this.PAGESPEED_API_KEY
                });
                return this.transformPageSpeedData(data);
            }
            catch (error) {
                console.error('PageSpeed API Error:', error.message);
                throw new Error('Failed to fetch PageSpeed insights');
            }
        });
    }
    transformPageSpeedData(data) {
        const categories = data.lighthouseResult.categories;
        const audits = data.lighthouseResult.audits;
        return {
            performance: {
                score: categories.performance.score * 100,
                metrics: {
                    firstContentfulPaint: audits['first-contentful-paint'].numericValue,
                    speedIndex: audits['speed-index'].numericValue,
                    largestContentfulPaint: audits['largest-contentful-paint'].numericValue,
                    cumulativeLayoutShift: audits['cumulative-layout-shift'].numericValue,
                    totalBlockingTime: audits['total-blocking-time'].numericValue
                }
            },
            accessibility: {
                score: categories.accessibility.score * 100
            },
            bestPractices: {
                score: categories['best-practices'].score * 100
            },
            seo: {
                score: categories.seo.score * 100
            }
        };
    }
}
exports.GoogleApiService = GoogleApiService;
