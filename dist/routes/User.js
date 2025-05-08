"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const AuthController_1 = require("../controllers/AuthController");
const IntegrationController_1 = require("../controllers/IntegrationController");
const router = express_1.default.Router();
const authController = new AuthController_1.AuthController();
const integrationController = new IntegrationController_1.IntegrationController();
router.post('/signup', authMiddleware_1.validateExistEmail, (req, res) => authController.register(req, res));
router.post('/signin', authMiddleware_1.validateEmail, authMiddleware_1.validateUser, (req, res) => authController.login(req, res));
router.get('/google/auth', (req, res) => authController.googleAuth(req, res));
router.get('/google/callback', (req, res) => integrationController.connectGoogle(req, res));
router.patch('/profile/:id', authMiddleware_1.validateExistUser, (req, res) => authController.updateProfile(req, res));
exports.default = router;
