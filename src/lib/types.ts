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
  // New fields for user management and status
  userId?: string;
  userEmail?: string;
  userName?: string;
  userPhotoURL?: string;
  status?: 'active' | 'found' | 'closed';
  contactInfo?: string;
  updatedAt?: string;
};

// This is the plain object we use in the app (client-side)
export interface Cat extends Omit<FirestoreCatData, 'location'> {
  location: { // Plain object replacement
    latitude: number;
    longitude: number;
  };
  latitude: number;
  longitude: number;
  // User and status fields
  userId?: string;
  userEmail?: string;
  userName?: string;
  userPhotoURL?: string;
  status?: 'active' | 'found' | 'closed';
  contactInfo?: string;
  updatedAt?: string;
}

// Comment interface for future comment system
export interface Comment {
  id: string;
  catId: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhotoURL?: string;
  content: string;
  createdAt: string;
  parentId?: string; // For nested replies
}

// User profile interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  contactInfo?: string;
  bio?: string;
  createdAt: string;
}
