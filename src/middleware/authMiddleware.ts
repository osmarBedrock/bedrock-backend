import { Request, Response, NextFunction } from 'express';
import { ClientService } from '../services/Client';

export const validateGoogleToken = (req: Request, res: Response, next: NextFunction) => {
  const { googleToken } = req.body;
  if (!googleToken) {
    res.status(400).json({ message: 'Google token is required' });
    return;
  }
  next();
};

export const validateEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email  } = req.body;
  if (!email) {
    res.status(400).json({ message: 'Email is required' });
    return;
  }
  const clientRepository = new ClientService();
  
  const user = await clientRepository.getUserByEmail(email);
  if(user){
    res.status(401).json({ message: 'Email already exist in the system'});
    return;
  }
  next();
};