import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import logger from './config/logger';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import errorHandler from './middlewares/errorHandler';
import helmet from 'helmet';

await connectDB();

// App instance
const app = express();

// Security headers
app.use(helmet());

// Middlewares
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (_req: Request, res: Response) => {
  res.send('Notes App Backend is running!');
});

// Auth routes connected here 
app.use('/api/auth', authRoutes);

// Health check route 
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is running perfectly' });
});

// Handle 404 Not Found requests
app.use((_req: Request, _res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${_req.originalUrl}`);
  _res.status(404);
  next(error);
});

// Global error handling middleware 
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Express Server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});