// Keep GeoPoint for Firestore writes, but use a plain object for client components
import type { GeoPoint } from "firebase/firestore";

// This is what we expect from Firestore
type FirestoreCatData = {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Unknown';
  type: string;
  breed: string;
  imageUrl: string;
  locationText: string;
  location: GeoPoint; // Firestore's GeoPoint
  createdAt: string; 
};

// This is the plain object we use in the app (client-side)
export interface Cat extends Omit<FirestoreCatData, 'location'> {
  location: { // Plain object replacement
    latitude: number;
    longitude: number;
  };
  latitude: number;
  longitude: number;
}
