'use client';

import { useState } from 'react';
import { compressImage, validateImage } from '@/lib/image-utils';

interface ImageCompressorProps {
    onImageCompressed: (compressedFile: File) => void;
    onError: (error: string) => void;
}

export function useImageCompressor() {
    const [isCompressing, setIsCompressing] = useState(false);

    const compressImageFile = async (file: File): Promise<{ success: boolean; file?: File; error?: string }> => {
        setIsCompressing(true);

        try {
            // Validate image
            const validation = validateImage(file);
            if (!validation.valid) {
                setIsCompressing(false);
                return { success: false, error: validation.error };
            }

            // Compress image
            const compressedBlob = await compressImage(file, 1200, 0.8);

            // Convert blob to File
            const compressedFile = new File([compressedBlob], file.name, {
                type: file.type,
                lastModified: Date.now(),
            });

            console.log('Image compression:', {
                original: `${(file.size / 1024).toFixed(2)} KB`,
                compressed: `${(compressedFile.size / 1024).toFixed(2)} KB`,
                reduction: `${(((file.size - compressedFile.size) / file.size) * 100).toFixed(1)}%`
            });

            setIsCompressing(false);
            return { success: true, file: compressedFile };
        } catch (error: any) {
            setIsCompressing(false);
            return { success: false, error: error.message || 'Failed to compress image' };
        }
    };

    return { compressImageFile, isCompressing };
}
