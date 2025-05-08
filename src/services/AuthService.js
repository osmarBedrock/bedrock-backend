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
exports.AuthService = void 0;
const bcrypt_1 = require("bcrypt");
class AuthService {
    constructor(userRepository, jwtSecret) {
        this.userRepository = userRepository;
        this.jwtSecret = jwtSecret;
    }
    registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield (0, bcrypt_1.hash)(userData.password, 10);
            return this.userRepository.createWithWebsite(Object.assign(Object.assign({}, userData), { passwordHash: hashedPassword }), { domain: userData.domain, verificationCode: `google-${crypto.randomUUID()}` });
        });
    }
}
exports.AuthService = AuthService;
