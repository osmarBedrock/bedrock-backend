import { google, pagespeedonline_v5, searchconsole_v1 } from 'googleapis';
import { format, sub } from "date-fns";
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { ReportBodyOptions, reportWithOrderBy } from '../constants/ReportBodyOptions';
import { buildReportBody } from '../helpers/analytics';
import { Range, ResponsePageSpeed } from '../interfaces/analytics';
import { searchConsoleDataDummy } from '../constant/data-dummy';
import { LighthousePerformanceWeights } from '../enum/performance.enum';

export class GoogleApiService {

  private PAGESPEED_API_KEY: string;
  protected oAuth2Client: OAuth2Client;
  protected pageSpeed: pagespeedonline_v5.Pagespeedonline;
  protected searchConsole: searchconsole_v1.Searchconsole; 


  constructor(clientId: string, clientSecret: string, redirectUri: string) {
    this.oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    this.pageSpeed = google.pagespeedonline("v5");
    this.PAGESPEED_API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY || '';
    this.searchConsole = google.searchconsole({ version: "v1", auth: this.oAuth2Client });
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
    ];
    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes,
    });
  }

  public setCredentials(tokens: any) {
    this.oAuth2Client.setCredentials(tokens);
  }

  public getToken() {
    return this.oAuth2Client.refreshAccessToken()
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

  public async getSearchConsoleData(siteUrl: string, range: Range, rowLimit: number) {
    // try {
    //   // Verificar si el usuario ya tiene acceso
    //   const res = await this.searchConsole.sites.list({});
    //   const hasAccess = res.data.siteEntry?.some((site: any) => site.siteUrl === siteUrl);
    //   console.log(res.data);

    //   if (hasAccess) {
    //     console.log(`✅ El usuario ya tiene acceso a ${siteUrl}`);
    //     return { message: `El usuario ya tiene acceso a ${siteUrl}` };
    //   }

    //   // Agregar al usuario automáticamente si no tiene acceso
    //   await this.searchConsole.sites.adduser({
    //     siteUrl,
    //     requestBody: {
    //       permissionLevel: "siteFullUser", // Puede ser "siteFullUser" o "siteOwner"
    //       emailAddress: userEmail,
    //     },
    //   });

    //   // console.log(`✅ Usuario ${userEmail} agregado con éxito a ${siteUrl}`);
    //   return { message: `Usuario  agregado a ${siteUrl}` ,data: res.data};
    // } catch (error) {
    //   console.error("❌ Error al agregar usuario:", error);
    //   throw new Error("Failed to add user to Search Console");
    // }
    const { startDate, endDate } = this.getDateRange(range);
    try {
        const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
        const response = 
        // await this.oAuth2Client.request<any>({
        //   url,
        //   method: 'POST',
        //   data: {
        //     startDate,
        //     endDate,
        //     dimensions: ['query'],
        //     rowLimit,
        //     type: "web",
        //   },
        // });
        searchConsoleDataDummy; 
    
        return response;
    } catch (error) {
        console.error('Error fetching Search Console data:', error);
        throw new Error('Failed to fetch Search Console data');
    }
  }

  public async getTokenUserData(code: string){
    try {
      console.log('--->code  ',code)
        const { tokens } = await this.oAuth2Client.getToken(code);
        
        console.log('tokens', tokens, tokens?.refresh_token );
        
        this.setCredentials(tokens);
        const { access_token: googleToken } = tokens;
    
        const oauth2 = google.oauth2({
          auth: this.oAuth2Client,
          version: 'v2',
        });
    
        const userInfo = await oauth2.userinfo.get();
        // {
        //   "id": "clx9qmb4d0001cc45tbpsbqu7",
        //   "name": "Prestige Oral and Facial Surgery",
        //   "gaPropertyId": "413032710",
        //   "gscSiteUrl": "sc-domain:prestigesurgery.com"
        // }
        // const analytics = await this.getAnalyticsDataV3('413032710')
        // const searchConsole = await this.getSearchConsoleData("sc-domain:prestigesurgery.com","7daysAgo","yesterday")
        
        const user = {
          email: userInfo.data.email,
          name: userInfo.data.name,
          picture: userInfo.data.picture,
          firstName: userInfo.data.given_name,
          LastName: userInfo.data.family_name,
        };
    
        // Generate token JWT
        const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '1h' });
    
        const refreshToken = await this._refreshAccessToken();
        return { user, token, googleToken, refreshToken };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to authenticate with Google');
    }
  }

  
  async _refreshAccessToken() {
    // if (!this.oAuth2Client.credentials.refresh_token) {
    //   throw new Error('No refresh token available to refresh the access token');
    // }
  
    const { credentials } = await this.oAuth2Client.refreshAccessToken();
    return credentials;
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

  public async getPageSpeedInsights(url: string, strategy: "desktop" | "mobile" = "desktop") {
  try {

    const { data }: any = await this.pageSpeed.pagespeedapi.runpagespeed({
      url,
      strategy, // Puede ser "desktop" o "mobile"
      key: this.PAGESPEED_API_KEY,
      category: ["performance", "accessibility", "best-practices", "seo", "pwa"],
    });

    const responsePageSpeed: ResponsePageSpeed = data;
    const audits = responsePageSpeed.lighthouseResult.audits;
    
    const response = {
      metrics: {
        performance: {
          score: responsePageSpeed.lighthouseResult.categories.performance.score * 100,
          title:  responsePageSpeed.lighthouseResult.categories.performance.title
        },
        speedIndex: {
          description: audits['speed-index'].description,
          time: audits["speed-index"].displayValue,
          title: audits['speed-index'].title,
          penalty: this.calculatePenalty(audits['speed-index'].score,'SPEED_INDEX'),
          metricScore: audits['speed-index'].score
        },
        firstContentfulPaint: {
          description: audits['first-contentful-paint'].description,
          time: audits["first-contentful-paint"].displayValue,
          title: audits['first-contentful-paint'].title,
          penalty: this.calculatePenalty(audits['first-contentful-paint'].score || 0,'FIRST_CONTENTFUL_PAINT'),
          metricScore: audits['first-contentful-paint'].score
        },
        largestContentfulPaint: {
          description: audits['largest-contentful-paint'].description,
          time: audits["largest-contentful-paint"].displayValue,
          title: audits['largest-contentful-paint'].title,          
          penalty: this.calculatePenalty(audits['largest-contentful-paint'].score || 0,'LARGEST_CONTENTFUL_PAINT'),
          metricScore: audits['largest-contentful-paint'].score
        },
        cumulativeLayoutShift: {
          description: audits['cumulative-layout-shift'].description,
          time: audits["cumulative-layout-shift"].displayValue,
          title: audits['cumulative-layout-shift'].title,          
          penalty: this.calculatePenalty(audits['cumulative-layout-shift'].score || 0,'CUMULATIVE_LAYOUT_SHIFT'),
          metricScore: audits['cumulative-layout-shift'].score
        },
        totalBlockingTime: {
          description: audits['total-blocking-time'].description,
          time: audits["total-blocking-time"].displayValue,
          title: audits['total-blocking-time'].title,          
          penalty: this.calculatePenalty(audits['total-blocking-time'].score || 0,'TOTAL_BLOCKING_TIME'),
          metricScore: audits['total-blocking-time'].score
        }
      },
      performance: {
        value: responsePageSpeed.lighthouseResult.categories.performance.score * 100,
        name: responsePageSpeed.lighthouseResult.categories.performance.title
      },
      accessibility: {
        value: responsePageSpeed.lighthouseResult.categories.accessibility.score * 100,
        name: responsePageSpeed.lighthouseResult.categories.accessibility.title
      },
      bestPractices: {
        value: responsePageSpeed.lighthouseResult.categories['best-practices'].score * 100,
        name: responsePageSpeed.lighthouseResult.categories['best-practices'].title
      },
      seo: {
        value: responsePageSpeed.lighthouseResult.categories.seo.score * 100,
        name: responsePageSpeed.lighthouseResult.categories.seo.title
      }
    }

    return response;
  } catch (error) {
    console.error("Error fetching PageSpeed Insights data:", error);
    throw new Error("Failed to fetch PageSpeed Insights data");
  }
}
private calculatePenalty(metricScore: number, metric: keyof typeof LighthousePerformanceWeights): number {
  const weight = LighthousePerformanceWeights[metric];
  const penalty = (1 - metricScore) * weight * 100;
  return Math.round(penalty || ( weight * 100 ) );
}

}
