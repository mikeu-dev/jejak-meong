'use server';

import { z } from 'zod';
import { addDoc, collection, serverTimestamp, GeoPoint } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/firebase';
import { suggestCatBreedsFromImage } from '@/ai/flows/suggest-cat-breeds-from-image';

const catSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  gender: z.enum(['Male', 'Female', 'Unknown']),
  type: z.string().min(1, 'Type is required'),
  breed: z.string().min(1, 'Breed is required'),
  locationText: z.string().min(1, 'Location is required'),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  imageUrl: z.string().url().optional(),
  imageUrls: z.array(z.string().url()).max(5).optional(),
  // User fields
  userId: z.string().optional(),
  userEmail: z.string().email().optional(),
  userName: z.string().optional(),
  userPhotoURL: z.string().url().optional(),
  contactInfo: z.string().optional(),
});

export type FormState = {
  message: string;
  success: boolean;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

/**
 * Helper function to convert a File to a data URI (for AI processing and storage)
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

  // Parse imageUrls from JSON string if present
  const imageUrlsRaw = formData.get('imageUrls');
  let imageUrls: string[] | undefined;
  if (imageUrlsRaw && typeof imageUrlsRaw === 'string') {
    try {
      imageUrls = JSON.parse(imageUrlsRaw);
    } catch (e) {
      console.error('Failed to parse imageUrls:', e);
    }
  }

  const validatedFields = catSchema.safeParse({
    name: formData.get('name'),
    gender: formData.get('gender'),
    type: formData.get('type'),
    breed: formData.get('breed'),
    locationText: formData.get('locationText'),
    latitude: formData.get('latitude'),
    longitude: formData.get('longitude'),
    imageUrl: formData.get('imageUrl') || undefined,
    imageUrls: imageUrls,
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

  try {
    console.log('Step 2: Attempting to write document to Firestore...');
    const catData: any = {
      name: validatedFields.data.name,
      gender: validatedFields.data.gender,
      type: validatedFields.data.type,
      breed: validatedFields.data.breed,
      locationText: validatedFields.data.locationText,
      location: new GeoPoint(validatedFields.data.latitude, validatedFields.data.longitude),
      createdAt: serverTimestamp(),
      status: 'active', // Default status
    };

    // Add image URLs if present
    if (validatedFields.data.imageUrl) {
      catData.imageUrl = validatedFields.data.imageUrl;
    }
    if (validatedFields.data.imageUrls && validatedFields.data.imageUrls.length > 0) {
      catData.imageUrls = validatedFields.data.imageUrls;
    }

    // Add user data if present
    if (validatedFields.data.userId) {
      catData.userId = validatedFields.data.userId;
    }
    if (validatedFields.data.userEmail) {
      catData.userEmail = validatedFields.data.userEmail;
    }
    if (validatedFields.data.userName) {
      catData.userName = validatedFields.data.userName;
    }
    if (validatedFields.data.userPhotoURL) {
      catData.userPhotoURL = validatedFields.data.userPhotoURL;
    }
    if (validatedFields.data.contactInfo) {
      catData.contactInfo = validatedFields.data.contactInfo;
    }

    const docRef = await addDoc(collection(db, "cats"), catData);
    console.log('Step 3: Document written to Firestore with ID:', docRef.id);

    revalidatePath('/');
    revalidatePath('/profile');
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
