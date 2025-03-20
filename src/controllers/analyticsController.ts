import { Request, Response } from 'express';
import { GoogleApiService } from '../services/GoogleApiService';

const googleService = new GoogleApiService(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!
);

export const getAnalyticsData = async (req: Request, res: Response) => {
  try {
    const { viewId, googleToken, range, metric,dimensions, isRealTime, keepEmptyRows } = req.body;

    googleService.setCredentials(googleToken);
    const body = googleService.getBodyAnalytics(range,metric, dimensions, isRealTime, keepEmptyRows);
    const data = await googleService.getAnalyticsDataV3(viewId, body, isRealTime);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics data', details: error });
  }
};

export const redirectAuthUrl = async (req: Request, res: Response) => {
    try{
        const authUrl = googleService.getAuthUrl();
        console.log('authUrl', authUrl)
        res.status(200).json({url: authUrl});
    }  catch (error){
        console.log('error', error)
        res.status(500).json({error: 'Failed to load auth', details: error})
    }
}

export const googleAuthCallback = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;

        if (!code) {
            res.status(400).json({ error: 'No authorization code provided' });
            return;
        }
    
        const { user, token, googleToken, refreshToken } = await googleService.getTokenUserData(code);
        res.status(200).json({ user, token, googleToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to authenticate with Google' });        
    }
};

export const registerNewUser = async (req: Request, res: Response) => {
  
}


export const getSearchConsoleData = async (req: Request, res: Response) => {
  try {
    const { googleToken, siteUrl, range, rowLimit } = req.body;
    googleService.setCredentials(googleToken);
    const data = await googleService.getSearchConsoleData(siteUrl, range, rowLimit);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch search console data', details: error });
  }
};

export const getPageSpeedData = async (req: Request, res: Response) => {
  try {
    const { googleToken, siteUrl, strategy } = req.body;
    googleService.setCredentials(googleToken);
    const data = await googleService.getPageSpeedInsights(siteUrl, strategy);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch search console data', details: error });
  }
};
