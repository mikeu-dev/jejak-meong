'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { compressImage, uploadMultipleImages, generateImageFilename } from '@/lib/firebase-storage';
import Image from 'next/image';

interface MultipleImageUploadProps {
    maxImages?: number;
    onUploadComplete: (urls: string[]) => void;
    onUploadProgress?: (progress: number) => void;
}

export function MultipleImageUpload({
    maxImages = 5,
    onUploadComplete,
    onUploadProgress,
}: MultipleImageUploadProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length === 0) return;

        // Check total images limit
        if (selectedFiles.length + files.length > maxImages) {
            toast({
                title: 'Terlalu Banyak Gambar',
                description: `Maksimal ${maxImages} gambar`,
                variant: 'destructive',
            });
            return;
        }

        // Validate file types
        const validFiles = files.filter((file) => file.type.startsWith('image/'));
        if (validFiles.length !== files.length) {
            toast({
                title: 'File Tidak Valid',
                description: 'Hanya file gambar yang diperbolehkan',
                variant: 'destructive',
            });
        }

        // Create preview URLs
        const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));

        setSelectedFiles((prev) => [...prev, ...validFiles]);
        setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    };

    const removeImage = (index: number) => {
        // Revoke object URL to free memory
        URL.revokeObjectURL(previewUrls[index]);

        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast({
                title: 'Tidak Ada Gambar',
                description: 'Pilih gambar terlebih dahulu',
                variant: 'destructive',
            });
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Compress images
            toast({
                title: 'Mengompresi Gambar',
                description: 'Mohon tunggu...',
            });

            const compressedFiles = await Promise.all(
                selectedFiles.map((file) => compressImage(file, 2, 1920))
            );

            // Upload to Firebase Storage
            const basePath = `cats/${generateImageFilename('cat')}`;

            const uploadResults = await uploadMultipleImages(
                compressedFiles,
                basePath,
                (progress) => {
                    setUploadProgress(progress);
                    onUploadProgress?.(progress);
                }
            );

            const uploadedUrls = uploadResults.map((result) => result.url);

            toast({
                title: 'Berhasil',
                description: `${uploadedUrls.length} gambar berhasil diupload`,
            });

            onUploadComplete(uploadedUrls);

            // Clean up
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
            setSelectedFiles([]);
            setPreviewUrls([]);
            setUploadProgress(0);
        } catch (error) {
            console.error('Upload error:', error);
            toast({
                title: 'Upload Gagal',
                description: 'Terjadi kesalahan saat mengupload gambar',
                variant: 'destructive',
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* File Input */}
            <div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isUploading || selectedFiles.length >= maxImages}
                />

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || selectedFiles.length >= maxImages}
                    className="w-full"
                >
                    <Upload className="mr-2 h-4 w-4" />
                    Pilih Gambar ({selectedFiles.length}/{maxImages})
                </Button>
            </div>

            {/* Preview Grid */}
            {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previewUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                            <Image
                                src={url}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6"
                                onClick={() => removeImage(index)}
                                disabled={isUploading}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Button */}
            {selectedFiles.length > 0 && (
                <Button
                    type="button"
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Mengupload... {Math.round(uploadProgress)}%
                        </>
                    ) : (
                        <>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Upload {selectedFiles.length} Gambar
                        </>
                    )}
                </Button>
            )}
        </div>
    );
}
