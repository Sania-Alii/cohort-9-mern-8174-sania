import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any; 
}

interface DecodedToken extends jwt.JwtPayload {
  id: string;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // checking if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET is missing in environment variables');
      }

      // verify token 
      const decoded = jwt.verify(token, secret) as DecodedToken;

      
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      
      req.user = user;

      next(); 
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    // block if no token provided 
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};