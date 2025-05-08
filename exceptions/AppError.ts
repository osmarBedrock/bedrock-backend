import { Response } from 'express';

export class AppError extends Error {
    constructor(
      public message: string,
      public statusCode: number = 500,
      public details?: any
    ) {
      super(message);
    }
}
  
export const handleError = (res: Response, error: unknown) => {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : 'Unknown error';
  
    res.status(statusCode).json({
      success: false,
      error: {
        message,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }
    });
};