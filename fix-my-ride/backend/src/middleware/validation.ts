import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return next(new AppError(errorMessages.join(', '), 400));
  }
  next();
};

// Auth validation
export const validateRegister = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('first_name').optional().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('last_name').optional().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('user_type').isIn(['driver', 'mechanic']).withMessage('User type must be driver or mechanic'),
  handleValidationErrors,
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required'),
  handleValidationErrors,
];

// Service request validation
export const validateCreateServiceRequest = [
  body('service_type').notEmpty().withMessage('Service type is required'),
  body('location.lat').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('location.lng').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description too long'),
  handleValidationErrors,
];

// Rating validation
export const validateCreateRating = [
  body('request_id').isUUID().withMessage('Invalid request ID'),
  body('ratee_id').isUUID().withMessage('Invalid user ID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().isLength({ max: 500 }).withMessage('Review too long'),
  handleValidationErrors,
];

// Message validation
export const validateSendMessage = [
  body('request_id').isUUID().withMessage('Invalid request ID'),
  body('receiver_id').isUUID().withMessage('Invalid receiver ID'),
  body('content').notEmpty().withMessage('Message content is required').isLength({ max: 1000 }).withMessage('Message too long'),
  handleValidationErrors,
];

// General validation
export const validateUUID = [
  param('id').isUUID().withMessage('Invalid ID format'),
  handleValidationErrors,
];

export const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  handleValidationErrors,
];