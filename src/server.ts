import dotenv from 'dotenv';
import Server from './api/app'

dotenv.config();

const server = new Server();

server.listen();