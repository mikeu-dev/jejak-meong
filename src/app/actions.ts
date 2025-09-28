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
  
  // DIAGNOSTIC STEP: TRY TO WRITE A SIMPLE DOCUMENT
  try {
    console.log("Attempting to write a simple test document to Firestore...");
    const docRef = await addDoc(collection(db, "cats"), {
      name: "Test Cat",
      breed: "Test Breed",
      createdAt: serverTimestamp(),
    });
    console.log("Test document written with ID: ", docRef.id);
    
    // If we reach here, Firestore connection is working.
    // We will return a success message for this test.
    revalidatePath('/');
    return { success: true, message: 'Firestore test write was successful!' };

  } catch (e: any) {
    console.error("!!! CRITICAL FIREBASE ERROR !!!", e);
    
    let errorMessage = 'Failed to add cat. An unexpected error occurred.';
    if (e.message) {
      errorMessage = `Critical Firestore Error: ${e.message}`;
    }
    
    if (e.code === 'failed-precondition' || (e.message && e.message.includes('firestore/unavailable'))) {
        errorMessage = 'Failed to add cat. Please ensure Firestore Database is enabled in your Firebase project console.';
    } else if (e.code === 'permission-denied') {
        errorMessage = 'Failed to add cat due to a permissions issue. Please check your Firestore security rules.';
    }
    
    return { success: false, message: errorMessage };
  }
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
