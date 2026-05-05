import { Router, Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { supabase } from '../config/supabase';
import { AppError } from '../middleware/errorHandler';

const router = Router();

const validateUUID = [
  param('id').isUUID().withMessage('Invalid ID'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array().map((err) => err.msg).join(', '), 400));
    }
    next();
  },
];

const validateStartSession = [
  body('request_id').isUUID().withMessage('request_id is required'),
  body('mechanic_id').isUUID().withMessage('mechanic_id is required'),
  body('current_location.lat').isFloat({ min: -90, max: 90 }).withMessage('current_location.lat is required'),
  body('current_location.lng').isFloat({ min: -180, max: 180 }).withMessage('current_location.lng is required'),
  body('destination.lat').isFloat({ min: -90, max: 90 }).withMessage('destination.lat is required'),
  body('destination.lng').isFloat({ min: -180, max: 180 }).withMessage('destination.lng is required'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array().map((err) => err.msg).join(', '), 400));
    }
    next();
  },
];

const validateUpdateLocation = [
  param('id').isUUID().withMessage('Invalid session ID'),
  body('current_location.lat').isFloat({ min: -90, max: 90 }).withMessage('current_location.lat is required'),
  body('current_location.lng').isFloat({ min: -180, max: 180 }).withMessage('current_location.lng is required'),
  body('status').optional().isString(),
  body('estimated_arrival_time').optional().isISO8601().withMessage('estimated_arrival_time must be ISO date'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array().map((err) => err.msg).join(', '), 400));
    }
    next();
  },
];

router.use(authenticate);

// Start a tracking session
router.post('/start-session', validateStartSession, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const { request_id, mechanic_id, current_location, destination, estimated_arrival_time, status } = req.body;

    const { data: session, error } = await supabase
      .from('tracking_sessions')
      .insert({
        request_id,
        mechanic_id,
        current_location,
        destination,
        estimated_arrival_time,
        status: status || 'en_route',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error || !session) throw new AppError('Failed to start tracking session', 500);

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
});

// Update tracking location
router.put('/:id/location', validateUpdateLocation, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.params.id;

    const { data: updatedSession, error } = await supabase
      .from('tracking_sessions')
      .update({
        current_location: req.body.current_location,
        status: req.body.status,
        estimated_arrival_time: req.body.estimated_arrival_time,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .select('*')
      .single();

    if (error || !updatedSession) throw new AppError('Failed to update tracking session', 500);

    res.status(200).json({ success: true, data: updatedSession });
  } catch (error) {
    next(error);
  }
});

// Get live tracking for a request
router.get('/:id/live', validateUUID, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestId = req.params.id;

    const { data: session, error } = await supabase
      .from('tracking_sessions')
      .select('*')
      .eq('request_id', requestId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !session) throw new AppError('Tracking session not found', 404);

    res.status(200).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
});

export default router;