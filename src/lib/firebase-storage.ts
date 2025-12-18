import { ref, uploadBytesResumable, getDownloadURL, deleteObject, UploadTaskSnapshot } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Callback untuk tracking progress upload
 */
export type UploadProgressCallback = (progress: number) => void;

/**
 * Hasil upload gambar
 */
export interface UploadResult {
    url: string;
    path: string;
    size: number;
}

/**
 * Compress gambar sebelum upload
 * @param file - File gambar yang akan di-compress
 * @param maxSizeMB - Ukuran maksimal dalam MB (default: 1MB)
 * @param maxWidthOrHeight - Lebar/tinggi maksimal dalam pixels (default: 1920px)
 * @returns Promise<File> - File yang sudah di-compress
 */
export async function compressImage(
    file: File,
    maxSizeMB: number = 1,
    maxWidthOrHeight: number = 1920
): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > height) {
                    if (width > maxWidthOrHeight) {
                        height *= maxWidthOrHeight / width;
                        width = maxWidthOrHeight;
                    }
                } else {
                    if (height > maxWidthOrHeight) {
                        width *= maxWidthOrHeight / height;
                        height = maxWidthOrHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                // Convert to blob with quality adjustment
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Failed to compress image'));
                            return;
                        }

                        // Check if compressed size is acceptable
                        const compressedSizeMB = blob.size / 1024 / 1024;
                        if (compressedSizeMB > maxSizeMB) {
                            // Try with lower quality
                            canvas.toBlob(
                                (lowerQualityBlob) => {
                                    if (!lowerQualityBlob) {
                                        reject(new Error('Failed to compress image'));
                                        return;
                                    }
                                    const compressedFile = new File([lowerQualityBlob], file.name, {
                                        type: 'image/jpeg',
                                        lastModified: Date.now(),
                                    });
                                    resolve(compressedFile);
                                },
                                'image/jpeg',
                                0.7
                            );
                        } else {
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        }
                    },
                    'image/jpeg',
                    0.9
                );
            };
            img.onerror = () => reject(new Error('Failed to load image'));
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
    });
}

/**
 * Upload gambar ke Firebase Storage
 * @param file - File gambar yang akan di-upload
 * @param path - Path di Firebase Storage (contoh: 'cats/cat-123.jpg')
 * @param onProgress - Callback untuk tracking progress (optional)
 * @returns Promise<UploadResult> - URL download dan metadata
 */
export async function uploadImage(
    file: File,
    path: string,
    onProgress?: UploadProgressCallback
): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot: UploadTaskSnapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                onProgress?.(progress);
            },
            (error) => {
                console.error('Upload error:', error);
                reject(error);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve({
                        url: downloadURL,
                        path: path,
                        size: uploadTask.snapshot.totalBytes,
                    });
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
}

/**
 * Upload multiple gambar ke Firebase Storage
 * @param files - Array file gambar yang akan di-upload
 * @param basePath - Base path di Firebase Storage (contoh: 'cats/cat-123')
 * @param onProgress - Callback untuk tracking overall progress (optional)
 * @returns Promise<UploadResult[]> - Array URL download dan metadata
 */
export async function uploadMultipleImages(
    files: File[],
    basePath: string,
    onProgress?: UploadProgressCallback
): Promise<UploadResult[]> {
    const totalFiles = files.length;
    let completedFiles = 0;

    const uploadPromises = files.map(async (file, index) => {
        const extension = file.name.split('.').pop() || 'jpg';
        const path = `${basePath}-${index}.${extension}`;

        const result = await uploadImage(file, path, (fileProgress) => {
            const overallProgress = ((completedFiles + fileProgress / 100) / totalFiles) * 100;
            onProgress?.(overallProgress);
        });

        completedFiles++;
        onProgress?.((completedFiles / totalFiles) * 100);

        return result;
    });

    return Promise.all(uploadPromises);
}

/**
 * Hapus gambar dari Firebase Storage
 * @param path - Path gambar di Firebase Storage
 */
export async function deleteImage(path: string): Promise<void> {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
}

/**
 * Hapus multiple gambar dari Firebase Storage
 * @param paths - Array path gambar di Firebase Storage
 */
export async function deleteMultipleImages(paths: string[]): Promise<void> {
    await Promise.all(paths.map((path) => deleteImage(path)));
}

/**
 * Generate unique filename untuk gambar
 * @param prefix - Prefix untuk filename (contoh: 'cat')
 * @param extension - Extension file (default: 'jpg')
 * @returns string - Unique filename
 */
export function generateImageFilename(prefix: string = 'image', extension: string = 'jpg'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `${prefix}-${timestamp}-${random}.${extension}`;
}

/**
 * Extract path dari Firebase Storage URL
 * @param url - Firebase Storage URL
 * @returns string | null - Path atau null jika bukan Firebase Storage URL
 */
export function extractPathFromUrl(url: string): string | null {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'firebasestorage.googleapis.com') {
            const pathMatch = urlObj.pathname.match(/\/o\/(.+?)\?/);
            if (pathMatch) {
                return decodeURIComponent(pathMatch[1]);
            }
        }
        return null;
    } catch {
        return null;
    }
}
