import express, { Request, Response } from 'express';
import { WebsiteController } from '../controllers/WebsiteController';
import { validateGoogleIntegration } from '../middleware/googleMiddleware';

const router = express.Router();

const websiteController = new WebsiteController();

router.post('/analytics', 
    validateGoogleIntegration, 
    (req: Request, res: Response) => websiteController.getAnalyticsWebsiteData(req, res)
);
router.post('/searchConsole', 
    validateGoogleIntegration, 
    (req: Request, res: Response) => websiteController.getWebsiteData(req, res)
);
// router.post('/searchConsole', validateGoogleToken, getSearchConsoleData);
// router.post('/pageSpeed', validateGoogleToken, getPageSpeedData);
// router.get('/auth', redirectAuthUrl)
// router.post('/callback', googleAuthCallback)

export default router;
