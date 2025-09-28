'use server';

import { z } from 'zod';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { revalidatePath } from 'next/cache';
import { GeoPoint } from 'firebase/firestore';


import { db, storage } from '@/lib/firebase';
import { suggestCatBreedsFromImage } from '@/ai/flows/suggest-cat-breeds-from-image';

const catSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  gender: z.enum(['Male', 'Female', 'Unknown']),
  type: z.string().min(1, 'Type is required'),
  breed: z.string().min(1, 'Breed is required'),
  locationText: z.string().min(1, 'Location is required'),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

export type FormState = {
  message: string;
  success: boolean;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

export async function addCat(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = catSchema.safeParse({
    name: formData.get('name'),
    gender: formData.get('gender'),
    type: formData.get('type'),
    breed: formData.get('breed'),
    locationText: formData.get('locationText'),
    latitude: formData.get('latitude'),
    longitude: formData.get('longitude'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Please correct the errors below.',
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const catData = validatedFields.data;

  if (!catData.latitude || !catData.longitude || !catData.locationText) {
    const errors: FormState['errors'] = {};
    if (!catData.latitude || !catData.longitude) {
        errors.locationText = ['Please select a location on the map.'];
    }
    if (!catData.locationText) {
        errors.locationText = [...(errors.locationText || []), 'Location description cannot be empty.'];
    }
    return {
      message: 'Location is not complete.',
      success: false,
      errors,
    };
  }

  const imageFile = formData.get('image') as File | null;
  if (!imageFile || imageFile.size === 0) {
    return {
      message: 'An image of the cat is required.',
      success: false,
      errors: { image: ['Please upload an image.'] },
    };
  }

  try {
    // 1. Upload image to Firebase Storage
    const storageRef = ref(storage, `cats/${Date.now()}-${imageFile.name}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(snapshot.ref);

    // 2. Add cat data to Firestore
    const { latitude, longitude, ...restOfCatData } = catData;
    await addDoc(collection(db, 'cats'), {
      ...restOfCatData,
      location: new GeoPoint(latitude, longitude),
      imageUrl,
      createdAt: serverTimestamp(),
    });

  } catch (e: any) {
    console.error("Error adding cat:", e);
    let errorMessage = 'Failed to add cat. An unexpected error occurred.';
    if (e.code === 'failed-precondition' || (e.message && e.message.includes('firestore/unavailable'))) {
        errorMessage = 'Failed to add cat. Please ensure Firestore Database is enabled in your Firebase project console.';
    }
    return { success: false, message: errorMessage };
  }

  revalidatePath('/');
  return { success: true, message: 'Cat reported successfully!' };
}

export async function getBreedSuggestions(formData: FormData): Promise<{ suggestions: string[]; error?: string }> {
  const imageFile = formData.get('image') as File | null;

  if (!imageFile || imageFile.size === 0) {
    return { suggestions: [], error: 'Please select an image first.' };
  }

  try {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const catImageDataUri = `data:${imageFile.type};base64,${buffer.toString('base64')}`;

    const result = await suggestCatBreedsFromImage({ catImageDataUri });

    if (result.suggestedBreeds && result.suggestedBreeds.length > 0) {
      return { suggestions: result.suggestedBreeds };
    } else {
      return { suggestions: [], error: 'Could not identify breed. Please enter manually.' };
    }
  } catch (error) {
    console.error('Error getting breed suggestions:', error);
    return { suggestions: [], error: 'An error occurred while suggesting breeds.' };
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<{ address?: string; error?: string }> {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }
    const data = await response.json();
    if (data && data.display_name) {
      return { address: data.display_name };
    }
    return { error: 'Could not find address for the selected location.' };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return { error: 'Failed to get address from location.' };
  }
}
