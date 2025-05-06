// src/jobs/domainVerification.job.ts
import cron from 'node-cron';
import { GoogleApiService } from '../services/GoogleApiService';

export class DomainVerificationJob {
  private googleService: GoogleApiService;

  constructor() {
    this.googleService = new GoogleApiService(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_REDIRECT_URI!
    );
  }

  public start(): void {
    // Programa la verificación diaria a las 3 AM
    cron.schedule('0 3 * * *', async () => {
      console.log('Iniciando verificación de dominios...');
      try {
        await this.verifyUnconfirmedDomains();
      } catch (error) {
        console.error('Error en el cron job:', error);
      }
    });
  }

  private async verifyUnconfirmedDomains(): Promise<void> {
    const websites = await prisma.website.findMany({
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
      await this.processWebsiteVerification(website);
    }
  }

  private async processWebsiteVerification(website: any): Promise<void> {
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
      const isVerified = await this.checkDomainVerification(website.domain);
      
      if (isVerified) {
        // await this.handleVerifiedDomain(website);
      }
    } catch (error) {
      await this.handleVerificationError(error, website);
    }
  }

  private async checkDomainVerification(domain: string): Promise<boolean> {
    try {
      const siteInfo = await this.googleService.getSearchConsoleSite(domain);
      return siteInfo.isVerified;
    } catch (error: any) {
      if (error.code === 404) return false;
      throw error;
    }
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

  private async handleVerificationError(error: any, website: any): Promise<void> {
    console.error(`Error verificando ${website.domain}:`, error.message);
    
    if (error.response?.status === 401) {
      console.log('Intentando refrescar token...');
      await this.handleTokenRefresh(website.user.id);
    }
  }

  private async handleTokenRefresh(userId: string): Promise<void> {
    try {
      await this.googleService.refreshAndUpdateTokens(userId);
      console.log('Token actualizado correctamente');
    } catch (refreshError) {
      console.error('Error refrescando token:', refreshError);
    }
  }
}