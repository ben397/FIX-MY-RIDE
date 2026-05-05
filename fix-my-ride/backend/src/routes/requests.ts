import { Router } from 'express';
import { RequestController } from '../controllers/requestController';
import { validateCreateServiceRequest, validateUUID, validatePagination } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create service request
router.post('/', validateCreateServiceRequest, RequestController.createRequest);

// Get user's requests
router.get('/', validatePagination, RequestController.getUserRequests);

// Get specific request
router.get('/:id', validateUUID, RequestController.getRequest);

// Update request
router.put('/:id', validateUUID, RequestController.updateRequest);

// Cancel request
router.post('/:id/cancel', validateUUID, RequestController.cancelRequest);

export default router;