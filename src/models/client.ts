import { Business } from "./business";
import { User } from "./user";

export class Client {
    constructor(
        public id: string,
        public name: string,
        public createdAt: Date,
        public updatedAt: Date,
        public users: User[], // Relación con User
        public businesses: Business[], // Relación con Business
    ) {}
}
