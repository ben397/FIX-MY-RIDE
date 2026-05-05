import axios from 'axios';
import { env } from '../config/env';

export interface GeocodeResult {
  lat: number;
  lng: number;
  address: string;
}

export interface DistanceResult {
  distance: number; // in meters
  duration: number; // in seconds
  distanceText: string;
  durationText: string;
}

export class GeolocationUtils {
  static async geocodeAddress(address: string): Promise<GeocodeResult> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address,
            key: env.GOOGLE_MAPS_API_KEY,
          },
        }
      );

      if (response.data.status !== 'OK') {
        throw new Error(`Geocoding failed: ${response.data.status}`);
      }

      const result = response.data.results[0];
      const location = result.geometry.location;

      return {
        lat: location.lat,
        lng: location.lng,
        address: result.formatted_address,
      };
    } catch (error) {
      throw new Error('Failed to geocode address');
    }
  }

  static async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            latlng: `${lat},${lng}`,
            key: env.GOOGLE_MAPS_API_KEY,
          },
        }
      );

      if (response.data.status !== 'OK') {
        throw new Error(`Reverse geocoding failed: ${response.data.status}`);
      }

      return response.data.results[0].formatted_address;
    } catch (error) {
      throw new Error('Failed to reverse geocode coordinates');
    }
  }

  static async getDistance(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ): Promise<DistanceResult> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json`,
        {
          params: {
            origin: `${origin.lat},${origin.lng}`,
            destination: `${destination.lat},${destination.lng}`,
            key: env.GOOGLE_MAPS_API_KEY,
          },
        }
      );

      if (response.data.status !== 'OK') {
        throw new Error(`Directions API failed: ${response.data.status}`);
      }

      const route = response.data.routes[0];
      const leg = route.legs[0];

      return {
        distance: leg.distance.value, // meters
        duration: leg.duration.value, // seconds
        distanceText: leg.distance.text,
        durationText: leg.duration.text,
      };
    } catch (error) {
      throw new Error('Failed to calculate distance');
    }
  }

  static calculateDistanceHaversine(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in km
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