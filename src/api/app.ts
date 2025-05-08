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
            origin: [
              'https://app.vantagewp.io',
              'https://api.app.vantagewp.io',
              'https://main.d2pfg8xcjwzzq.amplifyapp.com'
            ],
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
            optionsSuccessStatus: 204
        };
        // CORS
        this.app.use(cors(corsOptions));

        this.app.use(express.json());
        
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