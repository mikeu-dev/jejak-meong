'use server';

import { z } from 'zod';
import { GeoPoint, serverTimestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase';

// Reuse schema from actions.ts
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
 * Update cat report
 */
export async function updateCat(
    catId: string,
    userId: string,
    formData: FormData
): Promise<FormState> {
    const { doc, getDoc, updateDoc } = await import('firebase/firestore');

    try {
        // Check if user owns this cat report
        const catRef = doc(db, 'cats', catId);
        const catSnap = await getDoc(catRef);

        if (!catSnap.exists()) {
            return { success: false, message: 'Cat report not found.' };
        }

        const catData = catSnap.data();
        if (catData.userId !== userId) {
            return { success: false, message: 'You do not have permission to edit this report.' };
        }

        // Parse and validate fields
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
            contactInfo: formData.get('contactInfo') || undefined,
        });

        if (!validatedFields.success) {
            const errors = validatedFields.error.flatten().fieldErrors;
            return {
                success: false,
                message: 'Validation failed. Please check the form fields.',
                errors: errors,
            };
        }

        // Update document
        const updateData: any = {
            name: validatedFields.data.name,
            gender: validatedFields.data.gender,
            type: validatedFields.data.type,
            breed: validatedFields.data.breed,
            locationText: validatedFields.data.locationText,
            location: new GeoPoint(validatedFields.data.latitude, validatedFields.data.longitude),
            updatedAt: serverTimestamp(),
        };

        if (validatedFields.data.imageUrl) {
            updateData.imageUrl = validatedFields.data.imageUrl;
        }
        if (validatedFields.data.imageUrls) {
            updateData.imageUrls = validatedFields.data.imageUrls;
        }
        if (validatedFields.data.contactInfo) {
            updateData.contactInfo = validatedFields.data.contactInfo;
        }

        await updateDoc(catRef, updateData);

        revalidatePath('/');
        revalidatePath('/profile');
        revalidatePath(`/cat/${catId}`);

        return { success: true, message: 'Cat report updated successfully!' };
    } catch (error: any) {
        console.error('Error updating cat:', error);
        return { success: false, message: error.message || 'Failed to update cat report.' };
    }
}

/**
 * Delete cat report
 */
export async function deleteCat(
    catId: string,
    userId: string
): Promise<{ success: boolean; message: string }> {
    const { doc, getDoc, deleteDoc } = await import('firebase/firestore');
    const { ref, deleteObject } = await import('firebase/storage');
    const { storage } = await import('@/lib/firebase');

    try {
        // Check if user owns this cat report
        const catRef = doc(db, 'cats', catId);
        const catSnap = await getDoc(catRef);

        if (!catSnap.exists()) {
            return { success: false, message: 'Cat report not found.' };
        }

        const catData = catSnap.data();
        if (catData.userId !== userId) {
            return { success: false, message: 'You do not have permission to delete this report.' };
        }

        // Delete images from storage if they exist
        if (catData.imageUrl) {
            try {
                const imageRef = ref(storage, catData.imageUrl);
                await deleteObject(imageRef);
            } catch (error) {
                console.error('Error deleting main image:', error);
            }
        }

        if (catData.imageUrls && Array.isArray(catData.imageUrls)) {
            for (const imageUrl of catData.imageUrls) {
                try {
                    const imageRef = ref(storage, imageUrl);
                    await deleteObject(imageRef);
                } catch (error) {
                    console.error('Error deleting image:', error);
                }
            }
        }

        // Delete document
        await deleteDoc(catRef);

        revalidatePath('/');
        revalidatePath('/profile');

        return { success: true, message: 'Cat report deleted successfully!' };
    } catch (error: any) {
        console.error('Error deleting cat:', error);
        return { success: false, message: error.message || 'Failed to delete cat report.' };
    }
}

/**
 * Update cat status
 */
export async function updateCatStatus(
    catId: string,
    userId: string,
    newStatus: 'active' | 'found' | 'closed'
): Promise<{ success: boolean; message: string }> {
    const { doc, getDoc, updateDoc } = await import('firebase/firestore');

    try {
        // Check if user owns this cat report
        const catRef = doc(db, 'cats', catId);
        const catSnap = await getDoc(catRef);

        if (!catSnap.exists()) {
            return { success: false, message: 'Cat report not found.' };
        }

        const catData = catSnap.data();
        if (catData.userId !== userId) {
            return { success: false, message: 'You do not have permission to update this report.' };
        }

        // Update status
        await updateDoc(catRef, {
            status: newStatus,
            updatedAt: serverTimestamp(),
        });

        revalidatePath('/');
        revalidatePath('/profile');
        revalidatePath(`/cat/${catId}`);

        return { success: true, message: 'Status updated successfully!' };
    } catch (error: any) {
        console.error('Error updating status:', error);
        return { success: false, message: error.message || 'Failed to update status.' };
    }
}
