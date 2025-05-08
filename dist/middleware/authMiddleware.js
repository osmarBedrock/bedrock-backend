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
exports.validateUser = exports.validateExistUser = exports.validateExistEmail = exports.validateEmail = exports.validateGoogleToken = void 0;
const AuthController_1 = require("../controllers/AuthController");
const bcrypt_1 = require("bcrypt");
const validateGoogleToken = (req, res, next) => {
    const { googleToken } = req.body;
    if (!googleToken) {
        res.status(400).json({ message: 'Google token is required' });
        return;
    }
    next();
};
exports.validateGoogleToken = validateGoogleToken;
const validateEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
    }
    next();
});
exports.validateEmail = validateEmail;
const validateExistEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: 'Email is required' });
        return;
    }
    const authController = new AuthController_1.AuthController();
    const user = yield authController.existUser(req, res);
    if (user) {
        res.status(401).json({ message: 'Email already exist in the system' });
        return;
    }
    next();
});
exports.validateExistEmail = validateExistEmail;
const validateExistUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authController = new AuthController_1.AuthController();
    const user = yield authController.existUser(req, res);
    if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }
    req.body.user = user;
    next();
});
exports.validateExistUser = validateExistUser;
const validateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { password } = req.body;
    const authController = new AuthController_1.AuthController();
    const user = yield authController.existUser(req, res);
    if (!user || !(yield (0, bcrypt_1.compare)(password, (_a = user.passwordHash) !== null && _a !== void 0 ? _a : ''))) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }
    req.body.user = user;
    next();
});
exports.validateUser = validateUser;
