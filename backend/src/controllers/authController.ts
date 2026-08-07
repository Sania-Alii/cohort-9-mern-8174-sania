import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import logger from '../utils/logger';

// Generate token
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

// User Register 
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    // Validation
if (!name || !email || !password) {
    res.status(400).json({ message: 'Please provide all fields' });
  return;
}
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
      logger.info(`New user registered with ID: ${user._id}`);
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
// Handle duplicate email error 
    if (error.code === 11000) {
      res.status(409).json({ message: 'User already exists' });
      return;
    }

    logger.error('Error during registration');
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
      logger.info(`User logged in with ID: ${user._id}`);
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