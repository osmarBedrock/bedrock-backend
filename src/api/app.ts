import express, { Application } from "express";
import cors from "cors";
import clientRoutes from './../routes/Client'
import analyticsRoutes from './../routes/analyticsRoutes'
import userRoutes from './../routes/User'

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

        // CORS
        this.app.use(cors());

        this.app.use(express.json());

        this.app.use(express.static('public'));

    }

    routes() {
        this.app.use(this.routePath+'/client', clientRoutes);
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