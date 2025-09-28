'use server';

import { z } from 'zod';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { revalidatePath } from 'next/cache';

import { db, storage } from '@/lib/firebase';
import { suggestCatBreedsFromImage } from '@/ai/flows/suggest-cat-breeds-from-image';

const catSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  gender: z.enum(['Male', 'Female', 'Unknown']),
  type: z.string().min(1, 'Type is required'),
  breed: z.string().min(1, 'Breed is required'),
  locationText: z.string().min(1, 'Location is required'),
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
  });

  if (!validatedFields.success) {
    return {
      message: 'Please correct the errors below.',
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
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
    const catData = validatedFields.data;

    // 1. Upload image to Firebase Storage
    const storageRef = ref(storage, `cats/${Date.now()}-${imageFile.name}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(snapshot.ref);

    // 2. Add cat data to Firestore
    await addDoc(collection(db, 'cats'), {
      ...catData,
      imageUrl,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.error(e);
    return { success: false, message: 'Failed to add cat. An unexpected error occurred.' };
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
