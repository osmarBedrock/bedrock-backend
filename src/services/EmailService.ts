// src/services/EmailService.ts
import nodemailer from 'nodemailer';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: 'soporte@app.vantagewp.io',
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: process.env.GOOGLE_ACCESS_TOKEN
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendVerificationEmail(to: string, domain: string, token: string) {
    const mailOptions = {
      from: '"Vantage" <soporte@app.vantagewp.io>',
      to,
      subject: `Verifica tu dominio ${domain}`,
      text: `Agrega este TXT en tu DNS:\n\nTipo: TXT\nHost: @\nValor: google-site-verification=${token}`,
      html: this.buildHtmlTemplate(domain, token),
      headers: {
        'List-Unsubscribe': '<mailto:soporte@app.vantagewp.io?subject=Unsubscribe>',
        'X-Entity-Ref-ID': 'verification-email'
      }
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email enviado a ${to}`);
    } catch (error) {
      console.error('Error enviando email:', error);
      throw new Error('Falló el envío del correo');
    }
  }

  private buildHtmlTemplate(domain: string, token: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .verify-box { border: 1px solid #e2e8f0; padding: 20px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <h2>Verificación de Dominio ${domain}</h2>
        <div class="verify-box">
          <p>Agrega este registro TXT en tu DNS:</p>
          <p><strong>Tipo:</strong> TXT</p>
          <p><strong>Host:</strong> @</p>
          <p><strong>Valor:</strong> <code>google-site-verification=${token}</code></p>
        </div>
        <p>¿Necesitas ayuda? <a href="https://ayuda.tuapp.com/dns">Guía paso a paso</a></p>
        <p style="color: #718096; font-size: 0.9em;">Este es un correo automático, no respondas.</p>
      </body>
      </html>
    `;
  }
}