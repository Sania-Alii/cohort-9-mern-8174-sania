import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // checking if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // extracting token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // verify token using our secret key
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      // finding user and attaching it to req object excluding pswd
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      // custom attaching user to request
      (req as any).user = user;

      next(); // moving to the next function
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    // if no token provided 
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};