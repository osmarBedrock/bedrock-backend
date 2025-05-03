import express, { Request, Response } from 'express';
import { validateEmail, validateExistEmail, validateUser } from '../middleware/authMiddleware';
import { AuthController } from '../controllers/AuthController';
import { IntegrationController } from '../controllers/IntegrationController';
const router = express.Router();
const authController = new AuthController();
const integrationController = new IntegrationController();

router.post(
    '/signup', 
    validateExistEmail, 
    (req: Request, res: Response) => authController.register(req, res) 
);
router.post(
    '/signin',
    validateEmail,
    validateUser, 
    (req: Request, res: Response) => authController.login(req, res) 
);
router.get(
    '/google/auth',
    (req: Request, res: Response) => authController.googleAuth(req, res)
);
router.get(
    '/google/callback',
    (req: Request, res: Response) => integrationController.connectGoogle(req, res)
);
export default router;