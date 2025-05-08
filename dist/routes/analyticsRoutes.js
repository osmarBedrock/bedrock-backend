"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const WebsiteController_1 = require("../controllers/WebsiteController");
const googleMiddleware_1 = require("../middleware/googleMiddleware");
const router = express_1.default.Router();
const websiteController = new WebsiteController_1.WebsiteController();
router.post('/analytics', googleMiddleware_1.validateGoogleIntegration, (req, res) => websiteController.getAnalyticsWebsiteData(req, res));
router.post('/searchConsole', googleMiddleware_1.validateGoogleIntegration, (req, res) => websiteController.getWebsiteData(req, res));
// router.post('/searchConsole', validateGoogleToken, getSearchConsoleData);
// router.post('/pageSpeed', validateGoogleToken, getPageSpeedData);
// router.get('/auth', redirectAuthUrl)
// router.post('/callback', googleAuthCallback)
exports.default = router;
