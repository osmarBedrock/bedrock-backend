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
exports.validateGoogleIntegration = void 0;
const AuthController_1 = require("../controllers/AuthController");
const validateGoogleIntegration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authController = new AuthController_1.AuthController();
    const user = yield authController.userWithIntegrations(req, res);
    if ((user === null || user === void 0 ? void 0 : user.integrations.length) === 0) {
        res.status(400).json({ error: 'Google integration required' });
        return;
    }
    req.body.user = user;
    next();
});
exports.validateGoogleIntegration = validateGoogleIntegration;
