import { supabase } from '../config/supabase';
import { MechanicProfile, ServiceRequest } from '../types';
import { AppError } from '../middleware/errorHandler';

export class MatchingService {
  static async findNearbyMechanics(
    location: { lat: number; lng: number },
    serviceType?: string,
    radiusKm: number = 25
  ): Promise<MechanicProfile[]> {
    // This would use PostGIS for geospatial queries
    // For now, we'll use a simplified approach
    const { data: mechanics, error } = await supabase
      .from('mechanic_profiles')
      .select(`
        *,
        users!inner (
          id,
          first_name,
          last_name,
          rating,
          is_verified
        )
      `)
      .eq('is_available', true)
      .eq('documents_verified', true)
      .lte('service_radius_km', radiusKm);

    if (error) {
      throw new AppError('Failed to find nearby mechanics', 500);
    }

    // Filter by service type if specified
    let filteredMechanics = mechanics as any[];

    if (serviceType) {
      filteredMechanics = filteredMechanics.filter(mechanic =>
        mechanic.specializations?.includes(serviceType)
      );
    }

    // Calculate distances and sort by distance and rating
    // In a real implementation, you'd use PostGIS ST_Distance
    const mechanicsWithDistance = filteredMechanics.map(mechanic => ({
      ...mechanic,
      distance: this.calculateDistance(
        location.lat,
        location.lng,
        mechanic.current_location.lat,
        mechanic.current_location.lng
      ),
    }));

    return mechanicsWithDistance
      .sort((a, b) => {
        // Sort by distance first, then by rating
        if (Math.abs(a.distance - b.distance) < 1) {
          return b.users.rating - a.users.rating;
        }
        return a.distance - b.distance;
      })
      .slice(0, 10); // Return top 10 matches
  }

  static async assignMechanicToRequest(
    requestId: string,
    mechanicId: string
  ): Promise<ServiceRequest> {
    // Check if mechanic is available
    const { data: mechanic, error: mechanicError } = await supabase
      .from('mechanic_profiles')
      .select('is_available')
      .eq('user_id', mechanicId)
      .single();

    if (mechanicError || !mechanic?.is_available) {
      throw new AppError('Mechanic is not available', 400);
    }

    // Update request
    const { data: request, error } = await supabase
      .from('service_requests')
      .update({
        mechanic_id: mechanicId,
        status: 'assigned',
        assigned_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .eq('status', 'pending')
      .select()
      .single();

    if (error) {
      throw new AppError('Failed to assign mechanic', 500);
    }

    // Update mechanic availability
    await supabase
      .from('mechanic_profiles')
      .update({ is_available: false })
      .eq('user_id', mechanicId);

    return request as ServiceRequest;
  }

  static async releaseMechanic(mechanicId: string): Promise<void> {
    await supabase
      .from('mechanic_profiles')
      .update({ is_available: true })
      .eq('user_id', mechanicId);
  }

  private static calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}