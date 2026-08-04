import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from './config/logger';
import connectDB from './config/db';

dotenv.config()
//connecting database
connectDB();
//app instance
const app = express();
//Middlewares
app.use(cors());
app.use(express.json());
//test route
app.get('/', (req, res) => {
  res.send('Notes App Backend is running!');
});
//port 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    logger.info(`Server is successfully running on port ${PORT}`); 
});