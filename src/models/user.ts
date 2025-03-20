import { UserScope } from "@prisma/client";
import { Client } from "./client";

export class User {
    
    set _password(originPassword: string) {
        this.password = originPassword;
    }

    constructor(
        public name?: string,
        public firstName?: string,
        public lastName?: string,
        public email?: string,
        public password?: string,
        public avatarUrl?: string | null,
        public clientId?: string,
        public createdAt?: Date,
        public updatedAt?: Date,
        public scope?: UserScope,
        public client?: Client | null, // Relación con Client
        public isLoginGoogle?: boolean,
        public id?: string,
    ) {}
    
}
