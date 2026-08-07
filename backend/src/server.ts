import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import logger from './utils/logger';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import errorHandler from './middlewares/errorHandler';
import helmet from 'helmet';

// Load variables from .env file
dotenv.config();

// Connect Database 
connectDB();

const app = express();
// Security headers
app.use(helmet());

// Middlewares
app.use(cors());
app.use(express.json());

// Root test route
app.get('/', (req, res) => {
  res.send('Notes App Backend is running!');
});

// Health check route 
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running perfectly' });
});

// Auth routes connected here 
app.use('/api/auth', authRoutes);

// Global error handling middleware 
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

// Database Connection and Server Start
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      logger.info('MongoDB connection successful');
      
      app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
      });
    })
    .catch((error) => {
      logger.error(`MongoDB connection error: ${error.message}`);
    });
} else {
  logger.error('MONGO_URI is not defined in the .env file!');
}