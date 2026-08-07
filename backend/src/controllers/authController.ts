import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import logger from '../utils/logger';

// Generate token
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey', {
    expiresIn: '30d',
  });
};

// User Register 
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    // create new user
    const user = await User.create({
      name,
      email,
      password, 
    });

    if (user) {
      logger.info(`New user registered: ${user.email}`);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id as string),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    logger.error(`Error during registration: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// User Login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // matchPassword method from User model 
    if (user && (await (user as any).matchPassword(password))) {
      logger.info(`User logged in: ${user.email}`);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id as string),
      });
    } else {
      logger.info(`Failed login attempt for email: ${email}`);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    logger.error(`Error during login: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};