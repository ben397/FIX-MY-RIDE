import { Router, Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { supabase } from '../config/supabase';
import { AppError } from '../middleware/errorHandler';

const router = Router();

const validateVehicleBody = [
  body('make').isString().notEmpty().withMessage('make is required'),
  body('model').isString().notEmpty().withMessage('model is required'),
  body('year').optional().isInt({ min: 1900, max: 2100 }).withMessage('year must be valid'),
  body('color').optional().isString(),
  body('license_plate').optional().isString(),
  body('vin').optional().isString(),
  body('vehicle_type').optional().isString(),
  body('is_primary').optional().isBoolean(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array().map((err) => err.msg).join(', '), 400));
    }
    next();
  },
];

const validateUUID = [
  param('id').isUUID().withMessage('Invalid vehicle ID'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array().map((err) => err.msg).join(', '), 400));
    }
    next();
  },
];

router.use(authenticate);

// List authenticated user's vehicles
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Failed to fetch vehicles', 500);

    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    next(error);
  }
});

// Add a vehicle
router.post('/', validateVehicleBody, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const insertData = {
      user_id: req.user.id,
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      color: req.body.color,
      license_plate: req.body.license_plate,
      vin: req.body.vin,
      vehicle_type: req.body.vehicle_type,
      is_primary: req.body.is_primary ?? false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .insert(insertData)
      .select('*')
      .single();

    if (error || !vehicle) throw new AppError('Failed to add vehicle', 500);

    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
});

// Update a vehicle
router.put('/:id', validateUUID, validateVehicleBody, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const { id } = req.params;
    const { data: existing, error: fetchError } = await supabase
      .from('vehicles')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) throw new AppError('Vehicle not found', 404);
    if (existing.user_id !== req.user.id) throw new AppError('Not authorized to update vehicle', 403);

    const updates: any = {
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      color: req.body.color,
      license_plate: req.body.license_plate,
      vin: req.body.vin,
      vehicle_type: req.body.vehicle_type,
      is_primary: req.body.is_primary,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedVehicle, error: updateError } = await supabase
      .from('vehicles')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (updateError || !updatedVehicle) throw new AppError('Failed to update vehicle', 500);

    res.status(200).json({ success: true, data: updatedVehicle });
  } catch (error) {
    next(error);
  }
});

// Delete a vehicle
router.delete('/:id', validateUUID, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Not authenticated', 401);
    const { id } = req.params;

    const { data: existing, error: fetchError } = await supabase
      .from('vehicles')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) throw new AppError('Vehicle not found', 404);
    if (existing.user_id !== req.user.id) throw new AppError('Not authorized to delete vehicle', 403);

    const { error } = await supabase.from('vehicles').delete().eq('id', id);

    if (error) throw new AppError('Failed to delete vehicle', 500);

    res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;