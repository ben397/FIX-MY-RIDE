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

const validateMessage = [
  body('receiver_id').isUUID().withMessage('receiver_id is required'),
  body('content').isString().notEmpty().withMessage('content is required'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array().map((err) => err.msg).join(', '), 400));
    }
    next();
  },
];

router.use(authenticate);

// Get messages for a service request
router.get('/:id/messages', validateUUID, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const requestId = req.params.id;
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: true });

    if (error) throw new AppError('Failed to fetch messages', 500);

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
});

// Send a new message
router.post('/:id/messages', validateUUID, validateMessage, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const requestId = req.params.id;
    const { receiver_id, content } = req.body;

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        request_id: requestId,
        sender_id: req.user.id,
        receiver_id,
        content,
        is_read: false,
        created_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error || !message) throw new AppError('Failed to send message', 500);

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
});

// Mark message as read
router.put('/message/:id/read', validateUUID, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const messageId = req.params.id;
    const { data: existing, error: fetchError } = await supabase
      .from('messages')
      .select('receiver_id')
      .eq('id', messageId)
      .single();

    if (fetchError || !existing) throw new AppError('Message not found', 404);
    if (existing.receiver_id !== req.user.id) throw new AppError('Not authorized to mark this message as read', 403);

    const { data: updatedMessage, error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId)
      .select('*')
      .single();

    if (error || !updatedMessage) throw new AppError('Failed to update message', 500);

    res.status(200).json({ success: true, data: updatedMessage });
  } catch (error) {
    next(error);
  }
});

export default router;