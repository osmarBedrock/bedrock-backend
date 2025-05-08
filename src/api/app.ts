import express, { Application } from "express";
import cors from "cors";
import analyticsRoutes from './../routes/analyticsRoutes'
import userRoutes from './../routes/User'
import { DomainVerificationJob } from "../jobs/domainVerification.job";

class Server {
    app: Application;
    port: any;
    routePath: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.routePath = '/api';

        // Middlewares
        this.middlewares();

        // Application routes
        this.routes();
    }

    middlewares() {
        const corsOptions = {
            origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
                // list of allowed domains (add others if necessary)
                const allowedOrigins = [
                    'https://app.vantagewp.io',
                    'https://api.app.vantagewp.io',
                    'https://main.d2pfg8xcjwzzq.amplifyapp.com'
                ];
        
                // Allow requests without 'origin' (like Postman or server to server)
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
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
        this.app.use(cors(corsOptions));
        this.app.options('*', cors(corsOptions));
        this.app.use(express.json());
        
        this.app.use((req, res, next) => {
            // Essential header configuration
            res.header('Content-Type', 'application/json; charset=utf-8');
            next();
        });

        const domainVerificationJob = new DomainVerificationJob();
        domainVerificationJob.start();

        this.app.use(express.static('public'));

    }

    routes() {
        this.app.use(this.routePath+'/google', analyticsRoutes);
        this.app.use(this.routePath+'/user', userRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('server running in port: ', this.port);
        });
    }

}

export default Server;