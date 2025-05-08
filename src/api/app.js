"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const analyticsRoutes_1 = __importDefault(require("./../routes/analyticsRoutes"));
const User_1 = __importDefault(require("./../routes/User"));
const domainVerification_job_1 = require("../jobs/domainVerification.job");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT;
        this.routePath = '/api';
        // Middlewares
        this.middlewares();
        // Application routes
        this.routes();
    }
    middlewares() {
        const corsOptions = {
            origin: (origin, callback) => {
                // list of allowed domains (add others if necessary)
                const allowedOrigins = [
                    'https://app.vantagewp.io',
                    'https://api.app.vantagewp.io',
                    'https://main.d2pfg8xcjwzzq.amplifyapp.com'
                ];
                // Allow requests without 'origin' (like Postman or server to server)
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new Error('Blocked by CORS'));
                }
            },
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
            credentials: true,
            optionsSuccessStatus: 204,
            preflightContinue: false,
            debug: true
        };
        // CORS
        this.app.use((0, cors_1.default)(corsOptions));
        this.app.options('*', (0, cors_1.default)(corsOptions));
        this.app.use(express_1.default.json());
        const domainVerificationJob = new domainVerification_job_1.DomainVerificationJob();
        domainVerificationJob.start();
        this.app.use(express_1.default.static('public'));
    }
    routes() {
        this.app.use(this.routePath + '/google', analyticsRoutes_1.default);
        this.app.use(this.routePath + '/user', User_1.default);
    }
    listen() {
        this.app.listen(this.port, '0.0.0.0', () => {
            console.log('server running in port: ', this.port);
        });
    }
}
exports.default = Server;
