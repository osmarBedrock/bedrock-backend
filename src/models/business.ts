import { Client } from "./client";

export class Business {
    constructor(
        public id: string,
        public name: string,
        public gaPropertyId: string,
        public gscSiteUrl: string | null,
        public clientId: string,
        public createdAt: Date,
        public updatedAt: Date,
        public pageSpeed: string | null,
        public client: Client, // Relación con Client
        // public forms: FormSubmission[], // Relación con FormSubmission
    ) {}
}
