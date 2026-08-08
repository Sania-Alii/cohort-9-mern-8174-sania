import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  
  if (res.headersSent) {
    return next(err);
  }
  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  
  // Default values for message and stack
  let errorMessage = 'An unexpected error occurred';
  let errorStack = undefined;

  if (err instanceof Error) {
    errorMessage = err.message;
    errorStack = err.stack;
  }

  // Log the error details using Pino object
  logger.error({
    err: {
      message: errorMessage,
      stack: errorStack,
    },
    method: req.method,
    url: req.originalUrl,
  }, 'API Error');

  res.status(statusCode).json({
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : errorMessage,
    // show message in production
    stack: process.env.NODE_ENV === 'production' ? null : errorStack,
  });
};

export default errorHandler;