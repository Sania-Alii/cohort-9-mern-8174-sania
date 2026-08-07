import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import logger from './config/logger';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import errorHandler from './middlewares/errorHandler';
import helmet from 'helmet';

// Load variables from .env file
dotenv.config();

await connectDB();

//App instance
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

// Global error handling middleware 
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Express Server
app.listen(PORT, () => {
  logger.info('Server is running on port ${PORT}');
});