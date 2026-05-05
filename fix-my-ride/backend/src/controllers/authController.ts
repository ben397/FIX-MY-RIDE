import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { ApiResponse } from '../types';
import { AppError } from '../middleware/errorHandler';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, token } = await AuthService.register(req.body);

      const response: ApiResponse = {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            user_type: user.user_type,
            rating: user.rating,
            is_verified: user.is_verified,
          },
          token,
        },
        message: 'User registered successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.login(email, password);

      const response: ApiResponse = {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            user_type: user.user_type,
            rating: user.rating,
            is_verified: user.is_verified,
          },
          token,
        },
        message: 'Login successful',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(new AppError('User not authenticated', 401));
      }

      const response: ApiResponse = {
        success: true,
        data: {
          user: {
            id: req.user.id,
            email: req.user.email,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            user_type: req.user.user_type,
            phone: req.user.phone,
            rating: req.user.rating,
            total_ratings: req.user.total_ratings,
            is_verified: req.user.is_verified,
            profile_photo_url: req.user.profile_photo_url,
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(new AppError('User not authenticated', 401));
      }

      const allowedFields = [
        'first_name',
        'last_name',
        'phone',
        'profile_photo_url',
      ];

      const updates: any = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      const updatedUser = await AuthService.updateUser(req.user.id, updates);

      const response: ApiResponse = {
        success: true,
        data: {
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
            user_type: updatedUser.user_type,
            phone: updatedUser.phone,
            rating: updatedUser.rating,
            is_verified: updatedUser.is_verified,
            profile_photo_url: updatedUser.profile_photo_url,
          },
        },
        message: 'Profile updated successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}