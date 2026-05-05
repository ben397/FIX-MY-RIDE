import { Router, Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { supabase } from '../config/supabase';
import { AppError } from '../middleware/errorHandler';

const router = Router();

const validateUUID = [
  param('id').isUUID().withMessage('Invalid user ID'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array().map((err) => err.msg).join(', '), 400));
    }
    next();
  },
];

const validateUserUpdate = [
  body('first_name').optional().isString().isLength({ min: 2 }).withMessage('first_name must be at least 2 characters'),
  body('last_name').optional().isString().isLength({ min: 2 }).withMessage('last_name must be at least 2 characters'),
  body('phone').optional().isString().withMessage('phone must be a string'),
  body('profile_photo_url').optional().isURL().withMessage('profile_photo_url must be a valid URL'),
  body('is_active').optional().isBoolean().withMessage('is_active must be boolean'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array().map((err) => err.msg).join(', '), 400));
    }
    next();
  },
];

router.use(authenticate);

// Get current authenticated user
router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    return res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/:id', validateUUID, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, phone, user_type, profile_photo_url, rating, total_ratings, is_verified, is_active, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error || !user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/:id', validateUUID, validateUserUpdate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { id } = req.params;
    const allowedFields = ['first_name', 'last_name', 'phone', 'profile_photo_url', 'is_active'];
    const updates: Record<string, any> = {};

    if (req.user.id !== id && req.user.user_type !== 'admin') {
      throw new AppError('Not authorized to update this user', 403);
    }

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    updates.updated_at = new Date().toISOString();

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select('id, email, first_name, last_name, phone, user_type, profile_photo_url, rating, total_ratings, is_verified, is_active, created_at, updated_at')
      .single();

    if (error || !updatedUser) {
      throw new AppError('Failed to update user', 500);
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
});

export default router;