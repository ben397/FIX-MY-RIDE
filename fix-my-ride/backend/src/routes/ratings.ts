import { Router, Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
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

const validateNewRating = [
  body('request_id').isUUID().withMessage('request_id is required'),
  body('ratee_id').isUUID().withMessage('ratee_id is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('rating must be between 1 and 5'),
  body('review').optional().isString(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array().map((err) => err.msg).join(', '), 400));
    }
    next();
  },
];

const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array().map((err) => err.msg).join(', '), 400));
    }
    next();
  },
];

router.use(authenticate);

// Create a rating
router.post('/', validateNewRating, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const { request_id, ratee_id, rating, review } = req.body;

    const { data: ratingRecord, error } = await supabase
      .from('ratings')
      .insert({
        request_id,
        rater_id: req.user.id,
        ratee_id,
        rating,
        review,
        created_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error || !ratingRecord) throw new AppError('Failed to create rating', 500);

    await supabase
      .from('users')
      .update({
        rating: supabase.raw('ROUND(((rating * total_ratings) + ?) / (total_ratings + 1), 1)', [rating]),
        total_ratings: supabase.raw('total_ratings + 1'),
      })
      .eq('id', ratee_id);

    res.status(201).json({ success: true, data: ratingRecord });
  } catch (error) {
    next(error);
  }
});

// List reviews for a user
router.get('/:id/reviews', validateUUID, validatePagination, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '20', 10);
    const offset = (page - 1) * limit;

    const { data: reviews, error, count } = await supabase
      .from('ratings')
      .select('*, rater:users!ratings_rater_id_fkey(id, first_name, last_name, profile_photo_url)', { count: 'exact' })
      .eq('ratee_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new AppError('Failed to fetch reviews', 500);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;