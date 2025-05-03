import { Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/AuthController';
import { compare } from 'bcrypt';
export const validateGoogleToken = (req: Request, res: Response, next: NextFunction) => {
  const { googleToken } = req.body;
  if (!googleToken) {
    res.status(400).json({ message: 'Google token is required' });
    return;
  }
  next();
};

export const validateEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }
  
  next(); 
};

export const validateExistEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: 'Email is required' });
    return;
  }
  const authController = new AuthController();
  const user = await authController.existUser(req, res);
  if(user){
    res.status(401).json({ message: 'Email already exist in the system'});
    return;
  }
  next();
};

export const validateUser = async (req: Request, res: Response, next: NextFunction) => {

  const { password } = req.body;
  const authController = new AuthController();
  const user = await authController.existUser(req, res);
  
  if (!user || !(await compare(password, user.passwordHash ?? ''))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
  }
  req.body.user = user;
  next();
};