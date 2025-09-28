export interface Cat {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Unknown';
  type: string;
  breed: string;
  imageUrl: string;
  locationText: string;
  latitude: number;
  longitude: number;
  createdAt: string; // Using ISO string for serialization
}
