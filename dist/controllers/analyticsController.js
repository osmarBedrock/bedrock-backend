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
exports.AnalyticsController = void 0;
const config_1 = require("../database/config");
class AnalyticsController {
    constructor() {
        this.prisma = config_1.PrismaClientSingleton.getInstance();
    }
    getUsage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.headers['x-user-id'];
                const usage = yield this.prisma.planUsage.findUnique({
                    where: { userId: parseInt(userId) },
                    include: { user: true }
                });
                res.json({
                    websiteCount: (usage === null || usage === void 0 ? void 0 : usage.websiteCount) || 0,
                    leadCount: (usage === null || usage === void 0 ? void 0 : usage.leadCount) || 0,
                    chatbotUsage: (usage === null || usage === void 0 ? void 0 : usage.chatbotInteractionsToday) || 0
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Error fetching usage data' });
            }
        });
    }
    getKeywords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { domain } = req.params;
                const userId = req.headers['x-user-id'];
                const website = yield this.prisma.website.findFirst({});
                if (!website) {
                    return res.status(404).json({ error: 'Website not found' });
                }
                // Lógica para obtener keywords desde Search Console
                res.json({ keywords: [] });
            }
            catch (error) {
                res.status(500).json({ error: 'Error fetching keywords' });
            }
        });
    }
}
exports.AnalyticsController = AnalyticsController;
