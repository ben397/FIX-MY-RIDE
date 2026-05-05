import { Router, Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';
import Stripe from 'stripe';
import { authenticate } from '../middleware/auth';
import { supabase } from '../config/supabase';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2024-08-23' });

const validatePayment = [
  body('request_id').isUUID().withMessage('request_id is required'),
  body('amount').isNumeric().withMessage('amount is required'),
  body('currency').isString().notEmpty().withMessage('currency is required'),
  body('payment_method_id').isString().notEmpty().withMessage('payment_method_id is required'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array().map((err) => err.msg).join(', '), 400));
    }
    next();
  },
];

const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be positive'),
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

// Process a payment
router.post('/process-payment', validatePayment, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const { request_id, amount, currency, payment_method_id, description } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency,
      payment_method: payment_method_id,
      confirmation_method: 'manual',
      confirm: true,
      description: description || 'Fix-My-Ride service payment',
      metadata: {
        request_id,
        user_id: req.user.id,
      },
    });

    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        user_id: req.user.id,
        amount,
        transaction_type: 'charge',
        status: paymentIntent.status,
        created_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error || !transaction) throw new AppError('Failed to record payment transaction', 500);

    res.status(201).json({ success: true, data: { paymentIntent, transaction } });
  } catch (error) {
    next(error);
  }
});

// Fetch payment history
router.get('/history', validatePagination, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '20', 10);
    const offset = (page - 1) * limit;

    const { data: transactions, error, count } = await supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new AppError('Failed to fetch payment history', 500);

    res.status(200).json({
      success: true,
      data: transactions,
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

// Refund a payment
router.post('/refund', [
  body('transaction_id').isUUID().withMessage('transaction_id is required'),
  body('reason').optional().isString(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array().map((err) => err.msg).join(', '), 400));
    }
    next();
  },
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const { transaction_id, reason } = req.body;

    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transaction_id)
      .single();

    if (fetchError || !transaction) throw new AppError('Transaction not found', 404);
    if (transaction.user_id !== req.user.id) throw new AppError('Not authorized to refund this transaction', 403);
    if (transaction.status !== 'completed') throw new AppError('Only completed transactions may be refunded', 400);

    const refund = await stripe.refunds.create({
      payment_intent: transaction.payment_intent_id as string,
      reason: reason || 'requested_by_customer',
    });

    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: 'refunded',
        updated_at: new Date().toISOString(),
      })
      .eq('id', transaction_id);

    if (updateError) throw new AppError('Failed to update transaction status after refund', 500);

    res.status(200).json({ success: true, data: refund });
  } catch (error) {
    next(error);
  }
});

export default router;