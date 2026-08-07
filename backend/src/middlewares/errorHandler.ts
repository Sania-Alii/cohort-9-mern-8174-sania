import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // If the status code is still 200, change it to 500 (Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log the error details using Pino
  logger.error(`Error: ${err.message} - Method: ${req.method} - URL: ${req.originalUrl}`);

  res.status(statusCode).json({
    message: err.message,
    // Only show the stack trace in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler;