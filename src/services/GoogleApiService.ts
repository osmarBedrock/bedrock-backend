import { google, pagespeedonline_v5, searchconsole_v1, analyticsdata_v1beta, siteVerification_v1 } from 'googleapis';
import { format, sub } from "date-fns";
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { ReportBodyOptions, reportWithOrderBy } from '../constants/ReportBodyOptions';
import { buildReportBody } from '../helpers/analytics';
import { Range, ResponsePageSpeed, SearchConsoleResponse } from '../interfaces/analytics';
import { searchConsoleDataDummy } from '../constant/data-dummy';
import { LighthousePerformanceWeights } from '../enum/performance.enum';
import { SearchConsoleQueryRequest } from '../dtos/searchConsole';
import { TokenResponse } from 'google-auth-library/build/src/auth/impersonated';
import { PrismaClient } from '@prisma/client';
import { PrismaClientSingleton } from '../database/config';
export class GoogleApiService {

  private readonly oAuth2Client: OAuth2Client;
  private readonly pageSpeed: pagespeedonline_v5.Pagespeedonline;
  private readonly searchConsole: searchconsole_v1.Searchconsole;
  private readonly analyticsData: analyticsdata_v1beta.Analyticsdata;
  private siteVerification: siteVerification_v1.Siteverification;
  private readonly PAGESPEED_API_KEY: string;
  private prisma: PrismaClient;

  constructor(clientId: string, clientSecret: string, redirectUri: string) {
    this.prisma = PrismaClientSingleton.getInstance();
    this.oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    this.pageSpeed = google.pagespeedonline("v5");
    this.searchConsole = google.searchconsole({ version: "v1", auth: this.oAuth2Client });
    this.analyticsData = google.analyticsdata({ version: 'v1beta', auth: this.oAuth2Client });
    this.PAGESPEED_API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY || '';
    this.siteVerification = google.siteVerification({version: 'v1', auth: this.oAuth2Client});
  }

  public getAuthUrl() {
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

  public setCredentials(tokens: any) {
    this.oAuth2Client.setCredentials(tokens);
  }

  public async getToken(code: string):Promise<{
    tokens: any;
    userInfo: any;
    analyticsProperties?: any[];
  }>  {
    const { tokens } = await this.oAuth2Client.getToken(code);
    this.oAuth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: this.oAuth2Client,
      version: 'v2'
    });

    const userInfo = await oauth2.userinfo.get();
    
    // Get associated Analytics properties
    const analytics = google.analytics('v3');
    const properties = await analytics.management.webproperties.list({
      accountId: '~all',
      auth: this.oAuth2Client
    });

    return {
      tokens,
      userInfo: userInfo.data,
      analyticsProperties: properties.data.items
    };
  }

  public async getAnalyticsDataV4(
    propertyId: string,
    requestBody: any
  ): Promise<analyticsdata_v1beta.Schema$RunReportResponse> {
    try {
      const response = await this.analyticsData.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: {
          dateRanges: requestBody.dateRanges,
          dimensions: requestBody.dimensions,
          metrics: requestBody.metrics,
          dimensionFilter: requestBody.dimensionFilter,
          metricFilter: requestBody.metricFilter,
          limit: requestBody.limit?.toString(),
          offset: requestBody.offset?.toString(),
          orderBys: requestBody.orderBys,
          keepEmptyRows: requestBody.keepEmptyRows
        }
      });
  
      return this.transformAnalyticsData(response.data);
    } catch (error: any) {
      console.error('Analytics API Error:', error.message);
      throw new Error('Failed to fetch analytics data');
    }
  }
  
  private transformAnalyticsData(data: any) {
    return {
      rows: data.rows?.map((row: any) => ({
        dimensionValues: row.dimensionValues?.map((d: any) => d.value) || [],
        metricValues: row.metricValues?.map((m: any) => m.value) || []
      })) || [],
      totals: data.totals?.[0]?.metricValues?.map((m: any) => m.value) || [],
      rowCount: data.rowCount || 0
    };
  }

  public async refreshAccessToken(): Promise<TokenResponse> {
    try {
      const { credentials } = await this.oAuth2Client.refreshAccessToken();
      return {
        accessToken: credentials.access_token || '',
        expireTime: credentials.expiry_date ? 
          Math.round((credentials.expiry_date - Date.now()) / 1000).toString() : '3600'
      };
    } catch (error: any) {
      console.error('Token Refresh Error:', error.message);
      throw new Error('Failed to refresh access token');
    }
  }
  
  public async revokeToken(accessToken: string): Promise<void> {
    try {
      await this.oAuth2Client.revokeToken(accessToken);
      console.log('Token revoked successfully');
    } catch (error: any) {
      console.error('Token Revocation Error:', error.message);
      throw new Error('Failed to revoke token');
    }
  }

  public async getAnalyticsDataV3(viewId: string, data: ReportBodyOptions = reportWithOrderBy, isRealTime: boolean = false) {
    try {
      const url = `https://analyticsdata.googleapis.com/v1beta/properties/${viewId}:${ isRealTime ? 'runRealtimeReport' : 'runReport' }`;
  
      const response = await this.oAuth2Client.request<any>({
        url,
        method: 'POST',
        data,
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching Analytics data:', error);
      throw new Error('Failed to fetch Analytics data');
    }
  }

  public async getSearchConsoleData(siteUrl: string,request: SearchConsoleQueryRequest) {
      try {
        const response = await this.searchConsole.searchanalytics.query({
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
      } catch (error: any) {
        console.error('Search Console API Error:', error.message);
        throw new Error('Failed to fetch Search Console data');
      }
  }

  private transformSearchConsoleData(data: any): SearchConsoleResponse {
    return {
      rows: data.rows?.map((row: any) => ({
        keys: row.keys,
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position
      })) || [],
      aggregationType: data.aggregationType
    };
  }

  public async getAnalyticsData(
    propertyId: string,
    requestBody: analyticsdata_v1beta.Params$Resource$Properties$Runreport
  ): Promise<analyticsdata_v1beta.Schema$RunReportResponse> {
    try {
      const response = await this.analyticsData.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Analytics Data API Error:', error.message);
      throw new Error('Failed to fetch Analytics data');
    }
  }

  public async getTokenUserData(code: string){
    try {
        const { tokens } = await this.oAuth2Client.getToken(code);
        
        console.log('tokens', tokens, tokens?.refresh_token );
        
        this.setCredentials(tokens);
        // Get basic user info
        const oauth2 = google.oauth2({ version: 'v2', auth: this.oAuth2Client });    
        const userInfo = await oauth2.userinfo.get();
        
        // Additional verification for companies
        if (!userInfo.data.hd) {
          throw new Error('Corporate account required');
        }

        const user = {
          email: userInfo.data.email!,
          name: userInfo.data.name,
          picture: userInfo.data.picture,
          firstName: userInfo.data.given_name,
          lastName: userInfo.data.family_name,
          id: userInfo.data.id
        };
    
        // Generate token JWT
        const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '1h' });
    
        return { user, token, googleToken: tokens.access_token, refreshToken: tokens.refresh_token };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to authenticate with Google');
    }
  }
  
  public async verifyDomain(rawDomain: string) {
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
      await this.searchConsole.sites.add({
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
      const verification = await this.siteVerification.webResource.getToken({
        requestBody, // Pass the entire body
        auth: this.oAuth2Client // Required authentication
      });
  
      // 5. Return data for DNS configuration
      return {
        dnsRecord: `TXT ${domain} "google-site-verification=${verification.data.token}"`,
        verificationUrl: `https://search.google.com/search-console?resource_id=sc-domain:${domain}`
      };
  
    } catch (error: any) {
      console.error('Verification error:', {
        domain: rawDomain,
        code: error.code,
        errors: error.response?.data?.error?.errors
      });
      
      throw new Error(`Error ${error.code}: ${error.message}`);
    }
  }

  async getSearchConsoleSite(siteUrl: string): Promise<{ isVerified: boolean }> {
    try {
      const response = await this.searchConsole.sites.get({ siteUrl });
      return {
        isVerified: response.data?.siteUrl?.includes('sc-domain:') || false
      };
    } catch (error: any) {
      if (error.code === 404) return { isVerified: false };
      throw error;
    }
  }

  async refreshAndUpdateTokens(userId: string) {
    const integration = await this.prisma.integration.findUnique({
      where: { userId_service: { userId: parseInt(userId), service: 'google' } }
    });

    if (!integration) throw new Error('No Google integration found');

    const credentials = await this.refreshAccessToken();
    
    await this.prisma.integration.update({
      where: { id: integration.id },
      data: {
        accessToken: credentials.accessToken,
        expiresAt: new Date(Date.now() + (Number(credentials.expireTime) || 3600 * 1000))
      }
    });

    return credentials;
  }
  
  async _refreshAccessToken() {
    // if (!this.oAuth2Client.credentials.refresh_token) {
    //   throw new Error('No refresh token available to refresh the access token');
    // }
  
    const { credentials } = await this.oAuth2Client.refreshAccessToken();
    return credentials.refresh_token;
  }

  public getBodyAnalytics(range: Range, metrics: string[], dimensions: string[], isRealTime: boolean = false, keepEmptyRows: boolean = false): ReportBodyOptions {
    const { startDate, endDate } = this.getDateRange(range);
    return buildReportBody({startDate, endDate, range, metrics, dimensions, keepEmptyRows}, isRealTime);
  }
  
  private getDateRange(range: string): { startDate: string, endDate: string } {
    let startDate = "yesterday";
    const endDate = "yesterday";
    let yesterday = sub(new Date(), { days: 1 });
  
    switch (range) {
      case "day": {
        startDate = "2daysAgo";
        break;
      }
      case "week": {
        startDate = "7daysAgo";
        break;
      }
      case "month": {
        startDate = "30daysAgo";
        break;
      }
      case "quarter": {
        let start = sub(yesterday, { days: 89 });
        startDate = format(start, "yyyy-MM-dd");
        break;
      }
      default: {
        startDate = "7daysAgo";
        break;
      }
    }
  
    return { startDate, endDate };
  }

  public async getPageSpeedInsights(
    url: string, 
    strategy: 'mobile' | 'desktop' = 'mobile'
  ): Promise<ResponsePageSpeed> {
    try {
      const { data } = await this.pageSpeed.pagespeedapi.runpagespeed({
        url,
        strategy,
        category: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
        key: this.PAGESPEED_API_KEY
      });

      return this.transformPageSpeedData(data);
    } catch (error: any) {
      console.error('PageSpeed API Error:', error.message);
      throw new Error('Failed to fetch PageSpeed insights');
    }
  }

  private transformPageSpeedData(data: any): ResponsePageSpeed {
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
