import type { GeoPoint } from "firebase/firestore";

export interface Cat {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Unknown';
  type: string;
  breed: string;
  imageUrl: string;
  locationText: string;
  location: GeoPoint;
  latitude: number; // Kept for map rendering if needed client-side
  longitude: number; // Kept for map rendering if needed client-side
  createdAt: string; // Using ISO string for serialization
}
