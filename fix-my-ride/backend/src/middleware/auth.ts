import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';
import { env } from '../config/env';
import { AppError } from './errorHandler';
import { User } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export interface JwtPayload {
  userId: string;
  email: string;
  userType: 'driver' | 'mechanic' | 'admin';
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

      // Get user from database
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.userId)
        .single();

      if (error || !user) {
        return next(new AppError('User not found', 401));
      }

      if (!user.is_active) {
        return next(new AppError('User account is deactivated', 401));
      }

      req.user = user as User;
      next();
    } catch (err) {
      return next(new AppError('Not authorized to access this route', 401));
    }
  } catch (err) {
    next(err);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    if (!roles.includes(req.user.user_type)) {
      return next(
        new AppError(
          `User role ${req.user.user_type} is not authorized to access this route`,
          403
        )
      );
    }

    next();
  };
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('id', decoded.userId)
          .single();

        if (user) {
          req.user = user as User;
        }
      } catch (err) {
        // Token is invalid, but we don't throw error for optional auth
      }
    }

    next();
  } catch (err) {
    next(err);
  }
};