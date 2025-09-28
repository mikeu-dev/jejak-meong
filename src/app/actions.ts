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
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
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
  console.log('addCat action started.');

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
    console.error('Validation failed:', validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: 'Validation failed. Please check the form fields.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  console.log('Step 1: Validation successful.');

  const imageFile = formData.get('image') as File | null;
  let imageUrl = '';

  if (imageFile && imageFile.size > 0) {
    console.log('Step 2: Image file found. Attempting to upload to Firebase Storage...');
    try {
      const storageRef = ref(storage, `cats/${Date.now()}-${imageFile.name}`);
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      
      const snapshot = await uploadBytes(storageRef, buffer, {
        contentType: imageFile.type,
      });
      console.log('Image uploaded successfully. Snapshot:', snapshot);

      imageUrl = await getDownloadURL(snapshot.ref);
      console.log('Step 3: Got download URL:', imageUrl);
    } catch (error: any) {
      console.error('!!! FIREBASE STORAGE ERROR !!!', error);
      let errorMessage = 'Failed to upload image.';
       if (error.code === 'storage/unauthorized') {
          errorMessage = 'Image upload failed. Check your Firebase Storage security rules. You may need to allow writes.';
      } else if (error.message) {
          errorMessage = `Image upload error: ${error.message}`;
      }
      return { success: false, message: errorMessage };
    }
  } else {
    console.log('Step 2 & 3: No image file provided, skipping upload.');
  }

  try {
    console.log('Step 4: Attempting to write document to Firestore...');
    const data = {
      ...validatedFields.data,
      imageUrl,
      location: new GeoPoint(validatedFields.data.latitude, validatedFields.data.longitude),
      createdAt: serverTimestamp(),
    };
    
    // We don't need to store lat/lon separately as they are in the GeoPoint
    delete (data as any).latitude;
    delete (data as any).longitude;
    
    const docRef = await addDoc(collection(db, "cats"), data);
    console.log('Step 5: Document written to Firestore with ID:', docRef.id);

    revalidatePath('/');
    return { success: true, message: 'Cat reported successfully!' };

  } catch (error: any) {
    console.error("!!! FIRESTORE WRITE ERROR !!!", error);
    let errorMessage = 'Failed to save cat data. An unexpected error occurred.';
    if (error.code === 'permission-denied' || error.message.includes('permission-denied')) {
        errorMessage = 'Failed to save data. Please check your Firestore security rules.';
    } else if (error.message) {
        errorMessage = `Firestore Error: ${error.message}`;
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
