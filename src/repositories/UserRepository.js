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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.user.findUnique({
                where: { email },
                include: { websites: true, integrations: true }
            });
        });
    }
    createWithWebsite(userData, websiteData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.$transaction([
                this.prisma.user.create({ data: userData }),
                this.prisma.website.create({ data: websiteData })
            ]);
        });
    }
}
exports.UserRepository = UserRepository;
