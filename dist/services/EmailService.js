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
exports.EmailService = void 0;
// src/services/EmailService.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
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
    sendVerificationEmail(to, domain, token) {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield this.transporter.sendMail(mailOptions);
                console.log(`Email enviado a ${to}`);
            }
            catch (error) {
                console.error('Error enviando email:', error);
                throw new Error('Falló el envío del correo');
            }
        });
    }
    buildHtmlTemplate(domain, token) {
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
exports.EmailService = EmailService;
