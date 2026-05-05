import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { MatchingService } from '../services/matchingService';
import { NotificationService } from '../services/notificationService';
import { ApiResponse, ServiceRequest, CreateServiceRequestDto, UpdateServiceRequestDto } from '../types';
import { AppError } from '../middleware/errorHandler';

export class RequestController {
  static async createRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(new AppError('User not authenticated', 401));
      }

      const requestData: CreateServiceRequestDto = req.body;

      // Create service request
      const { data: request, error } = await supabase
        .from('service_requests')
        .insert({
          driver_id: req.user.id,
          vehicle_id: requestData.vehicle_id,
          service_type: requestData.service_type,
          description: requestData.description,
          location: requestData.location,
          pickup_location: requestData.pickup_location,
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        return next(new AppError('Failed to create service request', 500));
      }

      // Try to find and assign a mechanic automatically
      try {
        const nearbyMechanics = await MatchingService.findNearbyMechanics(
          requestData.location,
          requestData.service_type
        );

        if (nearbyMechanics.length > 0) {
          const assignedRequest = await MatchingService.assignMechanicToRequest(
            request.id,
            nearbyMechanics[0].user_id
          );

          // Create notification for driver
          await NotificationService.createNotification({
            user_id: req.user.id,
            type: 'request_match',
            title: 'Mechanic Found!',
            body: 'A mechanic has been assigned to your service request.',
            related_request_id: request.id,
          });

          // Create notification for mechanic
          await NotificationService.createNotification({
            user_id: nearbyMechanics[0].user_id,
            type: 'new_request',
            title: 'New Service Request',
            body: 'You have been assigned a new service request.',
            related_request_id: request.id,
          });

          const response: ApiResponse = {
            success: true,
            data: { request: assignedRequest },
            message: 'Service request created and mechanic assigned',
          };

          return res.status(201).json(response);
        }
      } catch (matchingError) {
        console.error('Auto-matching failed:', matchingError);
        // Continue without auto-matching
      }

      const response: ApiResponse = {
        success: true,
        data: { request },
        message: 'Service request created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(new AppError('User not authenticated', 401));
      }

      const { id } = req.params;

      const { data: request, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          vehicles (
            id,
            make,
            model,
            license_plate
          ),
          mechanic:users!service_requests_mechanic_id_fkey (
            id,
            first_name,
            last_name,
            rating,
            phone
          )
        `)
        .eq('id', id)
        .or(`driver_id.eq.${req.user.id},mechanic_id.eq.${req.user.id}`)
        .single();

      if (error || !request) {
        return next(new AppError('Service request not found', 404));
      }

      const response: ApiResponse = {
        success: true,
        data: { request },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getUserRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(new AppError('User not authenticated', 401));
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('service_requests')
        .select(`
          *,
          vehicles (
            id,
            make,
            model,
            license_plate
          ),
          mechanic:users!service_requests_mechanic_id_fkey (
            id,
            first_name,
            last_name,
            rating
          )
        `, { count: 'exact' });

      if (req.user.user_type === 'driver') {
        query = query.eq('driver_id', req.user.id);
      } else if (req.user.user_type === 'mechanic') {
        query = query.eq('mechanic_id', req.user.id);
      }

      const { data: requests, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        return next(new AppError('Failed to fetch requests', 500));
      }

      const response: ApiResponse = {
        success: true,
        data: {
          requests,
          pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit),
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(new AppError('User not authenticated', 401));
      }

      const { id } = req.params;
      const updates: UpdateServiceRequestDto = req.body;

      // Check if user can update this request
      const { data: existingRequest, error: fetchError } = await supabase
        .from('service_requests')
        .select('driver_id, mechanic_id, status')
        .eq('id', id)
        .single();

      if (fetchError || !existingRequest) {
        return next(new AppError('Service request not found', 404));
      }

      const canUpdate = 
        existingRequest.driver_id === req.user.id ||
        (existingRequest.mechanic_id === req.user.id && req.user.user_type === 'mechanic');

      if (!canUpdate) {
        return next(new AppError('Not authorized to update this request', 403));
      }

      // Update request
      const { data: request, error } = await supabase
        .from('service_requests')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return next(new AppError('Failed to update request', 500));
      }

      // Handle status-specific logic
      if (updates.status === 'completed' && existingRequest.mechanic_id) {
        await MatchingService.releaseMechanic(existingRequest.mechanic_id);
      }

      if (updates.status === 'cancelled' && existingRequest.mechanic_id) {
        await MatchingService.releaseMechanic(existingRequest.mechanic_id);
      }

      const response: ApiResponse = {
        success: true,
        data: { request },
        message: 'Request updated successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async cancelRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(new AppError('User not authenticated', 401));
      }

      const { id } = req.params;
      const { reason } = req.body;

      // Check if user can cancel this request
      const { data: existingRequest, error: fetchError } = await supabase
        .from('service_requests')
        .select('driver_id, mechanic_id, status')
        .eq('id', id)
        .single();

      if (fetchError || !existingRequest) {
        return next(new AppError('Service request not found', 404));
      }

      if (existingRequest.driver_id !== req.user.id) {
        return next(new AppError('Only the driver can cancel the request', 403));
      }

      if (!['pending', 'assigned'].includes(existingRequest.status)) {
        return next(new AppError('Cannot cancel request in current status', 400));
      }

      // Update request
      const { data: request, error } = await supabase
        .from('service_requests')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: reason,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return next(new AppError('Failed to cancel request', 500));
      }

      // Release mechanic if assigned
      if (existingRequest.mechanic_id) {
        await MatchingService.releaseMechanic(existingRequest.mechanic_id);
      }

      // Create notification for mechanic if assigned
      if (existingRequest.mechanic_id) {
        await NotificationService.createNotification({
          user_id: existingRequest.mechanic_id,
          type: 'request_cancelled',
          title: 'Request Cancelled',
          body: 'The service request has been cancelled by the driver.',
          related_request_id: id,
        });
      }

      const response: ApiResponse = {
        success: true,
        data: { request },
        message: 'Request cancelled successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}