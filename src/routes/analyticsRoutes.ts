import express from 'express';
import { getAnalyticsData, getSearchConsoleData, getPageSpeedData, googleAuthCallback, redirectAuthUrl } from '../controllers/analyticsController';
import { validateGoogleToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/analytics', validateGoogleToken, getAnalyticsData);
router.post('/searchConsole', validateGoogleToken, getSearchConsoleData);
router.post('/pageSpeed', validateGoogleToken, getPageSpeedData);
router.get('/auth', redirectAuthUrl)
router.post('/callback', googleAuthCallback)

export default router;
