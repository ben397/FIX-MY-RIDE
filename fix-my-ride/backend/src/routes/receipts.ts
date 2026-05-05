import { Router, Request, Response, NextFunction } from 'express';
import { param, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { supabase } from '../config/supabase';
import { AppError } from '../middleware/errorHandler';

const router = Router();

const validateUUID = [
  param('id').isUUID().withMessage('Invalid request ID'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array().map((err) => err.msg).join(', '), 400));
    }
    next();
  },
];

router.use(authenticate);

// Get receipt by request ID
router.get('/:id', validateUUID, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestId = req.params.id;

    const { data: receipt, error } = await supabase
      .from('receipts')
      .select('*')
      .eq('request_id', requestId)
      .single();

    if (error || !receipt) throw new AppError('Receipt not found', 404);

    res.status(200).json({ success: true, data: receipt });
  } catch (error) {
    next(error);
  }
});

// Generate receipt for request
router.post('/:id/generate', validateUUID, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestId = req.params.id;
    const { subtotal, tax, total, payment_method, items } = req.body;

    if (subtotal == null || tax == null || total == null || !items) {
      throw new AppError('subtotal, tax, total, and items are required', 400);
    }

    const payload = {
      request_id: requestId,
      subtotal,
      tax,
      total,
      payment_method,
      payment_status: 'completed',
      items,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: receipt, error } = await supabase
      .from('receipts')
      .upsert(payload, { onConflict: 'request_id' })
      .select('*')
      .single();

    if (error || !receipt) throw new AppError('Failed to generate receipt', 500);

    res.status(201).json({ success: true, data: receipt });
  } catch (error) {
    next(error);
  }
});

export default router;