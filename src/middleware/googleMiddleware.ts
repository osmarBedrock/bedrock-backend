import { Request, Response, NextFunction } from 'express';
import { AuthController } from "../controllers/AuthController";

export const validateGoogleIntegration = async (req: Request, res: Response, next: NextFunction) => {
    const authController = new AuthController();
    const user = await authController.userWithIntegrations(req, res);
    if (user?.integrations.length === 0) {
        res.status(400).json({ error: 'Google integration required' });
        return;
    }
    req.body.user = user;
    next();
};
