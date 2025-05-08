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
            origin: [
                'https://app.vantagewp.io',
                /\.amplifyapp\.com$/
            ],
            methods: ['GET,HEAD,PUT,PATCH,POST,DELETE', 'OPTIONS'],
            allowedHeaders: ['Authorization', 'Content-Type', 'X-Requested-With'],
            exposedHeaders: ['Authorization', 'X-Session-Id'],
            credentials: true,
            maxAge: 86400
        };
        // CORS
        this.app.use((0, cors_1.default)(corsOptions));
        this.app.options('*', (0, cors_1.default)(corsOptions));
        this.app.use((req, res, next) => {
            // Essential header configuration
            res.header('Content-Type', 'application/json; charset=utf-8');
            res.header('X-Powered-By', 'My Awesome API');
            res.header('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
            next();
        });
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
        this.app.listen(this.port, () => {
            console.log('server running in port: ', this.port);
        });
    }
}
exports.default = Server;
