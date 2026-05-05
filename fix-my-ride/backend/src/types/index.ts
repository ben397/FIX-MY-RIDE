export interface User {
  id: string;
  email: string;
  phone?: string;
  user_type: 'driver' | 'mechanic' | 'admin';
  first_name?: string;
  last_name?: string;
  profile_photo_url?: string;
  rating: number;
  total_ratings: number;
  is_verified: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Vehicle {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year?: number;
  color?: string;
  license_plate: string;
  vin?: string;
  vehicle_type?: string;
  is_primary: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ServiceRequest {
  id: string;
  driver_id: string;
  vehicle_id?: string;
  mechanic_id?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  service_type: string;
  description?: string;
  location: { lat: number; lng: number };
  pickup_location?: { lat: number; lng: number };
  estimated_cost?: number;
  actual_cost?: number;
  request_created_at: Date;
  assigned_at?: Date;
  started_at?: Date;
  completed_at?: Date;
  cancelled_at?: Date;
  cancellation_reason?: string;
  created_at: Date;
  updated_at: Date;
}

export interface MechanicProfile {
  id: string;
  user_id: string;
  specializations: string[];
  years_of_experience?: number;
  current_location: { lat: number; lng: number };
  is_available: boolean;
  service_radius_km: number;
  hourly_rate?: number;
  certifications?: string[];
  documents_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Rating {
  id: string;
  request_id: string;
  rater_id: string;
  ratee_id: string;
  rating: number;
  review?: string;
  created_at: Date;
}

export interface Message {
  id: string;
  request_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: Date;
}

export interface Receipt {
  id: string;
  request_id: string;
  subtotal: number;
  tax: number;
  total: number;
  payment_method?: string;
  payment_status: 'pending' | 'completed' | 'failed';
  items: any[];
  created_at: Date;
  updated_at: Date;
}

export interface TrackingSession {
  id: string;
  request_id: string;
  mechanic_id: string;
  current_location: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  estimated_arrival_time?: Date;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  related_request_id?: string;
  data?: any;
  created_at: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request/Response DTOs
export interface CreateServiceRequestDto {
  vehicle_id?: string;
  service_type: string;
  description?: string;
  location: { lat: number; lng: number };
  pickup_location?: { lat: number; lng: number };
}

export interface UpdateServiceRequestDto {
  status?: ServiceRequest['status'];
  mechanic_id?: string;
  estimated_cost?: number;
  actual_cost?: number;
  cancellation_reason?: string;
}

export interface CreateRatingDto {
  request_id: string;
  ratee_id: string;
  rating: number;
  review?: string;
}

export interface SendMessageDto {
  request_id: string;
  receiver_id: string;
  content: string;
}