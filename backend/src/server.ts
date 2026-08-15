import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import logger from './config/logger';
import pinoHttp from 'pino-http';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import noteRoutes from './routes/noteRoutes';
import errorHandler from './middlewares/errorHandler';
import helmet from 'helmet';

const app = express();
app.use(helmet());

// Middlewares
app.use(cors());
app.use(express.json());

// log all incoming http requests automatically
app.use(pinoHttp({ logger }));

// Root route
app.get('/', (_req: Request, res: Response) => {
  res.send('Notes App Backend is running!');
});

// Auth routes connected here 
app.use('/api/auth', authRoutes);

// Notes routes connected here
app.use('/api/notes', noteRoutes);

// Health check route 
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is running perfectly' });
});

// Handle 404 Not Found requests
app.use((_req: Request, res: Response, next: NextFunction) => {
  const error = new Error('Not Found');
  res.status(404);
  next(error);
});

// Global error handling middleware 
app.use(errorHandler);

const PORT = process.env.PORT || 5000;


const startServer = async (): Promise<void> => {
  // Wait for database to connect FIRST
  await connectDB();
  // Only start listening AFTER database is successfully connected
  const server = app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      logger.error(`Port ${PORT} is already in use`);
    } else {
      logger.error(`Server startup error: ${error.message}`);
    }
    process.exit(1);
  });
};

startServer();
export default app;