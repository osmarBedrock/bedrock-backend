import express, { Request, Response } from 'express';
import { validateEmail, validateExistEmail, validateUser } from '../middleware/authMiddleware';
import { AuthController } from '../controllers/AuthController';

const router = express.Router();
const authController = new AuthController();

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
export default router;