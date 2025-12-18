'use server';

import { z } from 'zod';
import { addDoc, collection, serverTimestamp, GeoPoint } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { revalidatePath } from 'next/cache';

import { db, storage } from '@/lib/firebase';
import { suggestCatBreedsFromImage } from '@/ai/flows/suggest-cat-breeds-from-image';
import { generateStorageFilename } from '@/lib/image-utils';

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

/**
 * Upload image to Firebase Storage and return download URL
 */
async function uploadImageToStorage(file: File): Promise<string> {
  const filename = generateStorageFilename(file.name);
  const storageRef = ref(storage, `cats/${filename}`);

  // Upload file
  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type,
    customMetadata: {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
    },
  });

  // Get download URL
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}

/**
 * Helper function to convert a File to a data URI (for AI processing)
 */
async function fileToDataUri(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}


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
    const errors = validatedFields.error.flatten().fieldErrors;
    console.error('Validation failed:', errors);
    return {
      success: false,
      message: 'Validation failed. Please check the form fields.',
      errors: errors,
    };
  }

  console.log('Step 1: Validation successful.');

  const imageFile = formData.get('image') as File | null;
  let imageUrl = '';

  if (imageFile && imageFile.size > 0) {
    console.log('Step 2: Image file found. Uploading to Firebase Storage...');
    try {
      // Upload to Firebase Storage instead of converting to Data URI
      imageUrl = await uploadImageToStorage(imageFile);
      console.log('Step 3: Image uploaded to Storage successfully. URL:', imageUrl);
    } catch (error: any) {
      console.error('!!! IMAGE UPLOAD ERROR !!!', error);
      return { success: false, message: `Failed to upload image: ${error.message}` };
    }
  } else {
    console.log('Step 2 & 3: No image file provided, skipping.');
  }

  try {
    console.log('Step 4: Attempting to write document to Firestore...');
    const catData = {
      name: validatedFields.data.name,
      gender: validatedFields.data.gender,
      type: validatedFields.data.type,
      breed: validatedFields.data.breed,
      locationText: validatedFields.data.locationText,
      imageUrl: imageUrl, // Storing Storage URL instead of Data URI
      location: new GeoPoint(validatedFields.data.latitude, validatedFields.data.longitude),
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "cats"), catData);
    console.log('Step 5: Document written to Firestore with ID:', docRef.id);

    revalidatePath('/');
    return { success: true, message: 'Cat reported successfully!' };

  } catch (error: any) {
    console.error("!!! FIRESTORE WRITE ERROR !!!", error);
    let errorMessage = 'Failed to save cat data. An unexpected error occurred.';
    if (error.code === 'permission-denied') {
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
    const catImageDataUri = await fileToDataUri(imageFile);
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
