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
exports.checkPlanLimits = void 0;
const config_1 = require("../database/config");
const checkPlanLimits = (resource) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const prisma = config_1.PrismaClientSingleton.getInstance();
            const user = yield prisma.user.findUnique({
                where: {
                    id: req.user.id
                }
            });
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            switch (resource) {
                case 'LEADS':
                    const leadCount = yield prisma.lead.count({ where: { userId: user.id } });
                    if ((user.planType === 'ESSENTIALS' && leadCount >= 500) ||
                        (user.planType === 'PRO' && leadCount >= 5000) ||
                        (user.planType === 'ELITE' && leadCount >= 10000)) {
                        return res.status(403).json({ error: 'Límite de contactos alcanzado para tu plan' });
                    }
                    break;
                case 'CHATBOT':
                    if (user.planType === 'ESSENTIALS' || user.planType === 'PRO') {
                        const today = new Date().toISOString().split('T')[0];
                        const interactions = yield prisma.dailyChatbotUsage.count({
                            where: {
                                userId: user.id,
                                lastResetDate: {
                                    gte: `${today} 00:00:00`,
                                    lte: `${today} 23:59:59`
                                }
                            }
                        });
                        const limit = user.planType === 'ESSENTIALS' ? 100 : 500;
                        if (interactions >= limit) {
                            return res.status(403).json({ error: 'Límite diario de interacciones con chatbot alcanzado' });
                        }
                    }
                    break;
                case 'WEBSITES':
                    if (user.planType !== 'ELITE') {
                        const websiteCount = yield prisma.website.count({ where: { userId: user.id } });
                        if (websiteCount >= 1) {
                            return res.status(403).json({ error: 'Tu plan solo permite un sitio web. Actualiza a ELITE para múltiples sitios.' });
                        }
                    }
                    break;
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.checkPlanLimits = checkPlanLimits;
