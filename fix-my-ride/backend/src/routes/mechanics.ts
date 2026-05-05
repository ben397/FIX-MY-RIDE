import { Router, Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { supabase } from '../config/supabase';
import { AppError } from '../middleware/errorHandler';

const router = Router();

const validateUUID = [
  param('id').isUUID().withMessage('Invalid mechanic ID'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array().map((err) => err.msg).join(', '), 400));
    }
    next();
  },
];

const validateAvailabilityUpdate = [
  body('is_available').isBoolean().withMessage('is_available is required and must be boolean'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array().map((err) => err.msg).join(', '), 400));
    }
    next();
  },
];

const validateNearbySearch = [
  query('lat').isFloat({ min: -90, max: 90 }).withMessage('lat is required'),
  query('lng').isFloat({ min: -180, max: 180 }).withMessage('lng is required'),
  query('radius').optional().isInt({ min: 1, max: 100 }).withMessage('radius must be between 1 and 100'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array().map((err) => err.msg).join(', '), 400));
    }
    next();
  },
];

router.use(authenticate);

// Search nearby mechanics
router.get('/', validateNearbySearch, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const service_type = req.query.service_type as string | undefined;
    const radius = parseInt((req.query.radius as string) || '25', 10);

    const { data: mechanics, error } = await supabase
      .from('mechanic_profiles')
      .select('*, users!inner(id, first_name, last_name, rating, profile_photo_url, user_type, is_verified)')
      .eq('is_available', true)
      .lte('service_radius_km', radius);

    if (error) throw new AppError('Failed to fetch mechanics', 500);

    const filtered = (mechanics || []).filter((mechanic: any) => {
      if (!service_type) return true;
      return Array.isArray(mechanic.specializations) && mechanic.specializations.includes(service_type);
    });

    res.status(200).json({ success: true, data: filtered });
  } catch (error) {
    next(error);
  }
});

// Get mechanic profile
router.get('/:id/profile', validateUUID, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mechanicId = req.params.id;

    const { data: profile, error } = await supabase
      .from('mechanic_profiles')
      .select('*, users!inner(id, first_name, last_name, rating, profile_photo_url, phone, is_verified)')
      .eq('user_id', mechanicId)
      .single();

    if (error || !profile) throw new AppError('Mechanic profile not found', 404);

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
});

// Update mechanic availability
router.put('/:id/availability', validateUUID, validateAvailabilityUpdate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Not authenticated', 401);
    const mechanicId = req.params.id;

    if (req.user.user_type !== 'mechanic' && req.user.user_type !== 'admin') {
      throw new AppError('Not authorized to update availability', 403);
    }

    if (req.user.user_type === 'mechanic' && req.user.id !== mechanicId) {
      throw new AppError('Mechanics can only update their own availability', 403);
    }

    const { data: updatedProfile, error } = await supabase
      .from('mechanic_profiles')
      .update({
        is_available: req.body.is_available,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', mechanicId)
      .select('*')
      .single();

    if (error || !updatedProfile) throw new AppError('Failed to update availability', 500);

    res.status(200).json({ success: true, data: updatedProfile });
  } catch (error) {
    next(error);
  }
});

export default router;