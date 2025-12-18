'use client';

import { useState, useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Camera, Loader2, X } from 'lucide-react';

import { updateCat, type FormState } from '@/app/cat-actions';
import { getBreedSuggestions, reverseGeocode } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { LocationPicker } from './location-picker';
import { useLanguage } from '@/context/language-context';
import type { Cat } from '@/lib/types';

const initialState: FormState = {
    message: '',
    success: false,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="animate-spin" /> : 'Update Laporan'}
        </Button>
    );
}

interface EditCatDialogProps {
    cat: Cat;
    userId: string;
    children: React.ReactNode;
    onSuccess?: () => void;
}

export function EditCatDialog({ cat, userId, children, onSuccess }: EditCatDialogProps) {
    const { t, tError } = useLanguage();
    const [open, setOpen] = useState(false);
    const [formState, formAction] = useActionState<FormState, FormData>(
        async (prevState: FormState, formData: FormData) => {
            const result = await updateCat(cat.id, userId, formData);
            if (result.success) {
                setOpen(false);
                onSuccess?.();
            }
            return result;
        },
        initialState
    );
    const [imagePreview, setImagePreview] = useState<string | null>(cat.imageUrl || null);
    const [breedSuggestions, setBreedSuggestions] = useState<string[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [location, setLocation] = useState<{ lat: number; lon: number }>({
        lat: cat.latitude,
        lon: cat.longitude,
    });
    const [isGeocoding, setIsGeocoding] = useState(false);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const breedInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const locationTextRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (formState.message) {
            const isSuccess = formState.success;
            toast({
                title: isSuccess ? 'Berhasil' : 'Error',
                description: formState.message,
                variant: isSuccess ? 'default' : 'destructive',
            });
        }
    }, [formState, toast]);

    const handleLocationSelect = async (coords: { lat: number; lon: number }) => {
        setLocation(coords);
        setIsGeocoding(true);
        if (locationTextRef.current) locationTextRef.current.value = 'Mengambil alamat...';
        const result = await reverseGeocode(coords.lat, coords.lon);
        setIsGeocoding(false);
        if (result.address && locationTextRef.current) {
            locationTextRef.current.value = result.address;
        } else if (result.error) {
            if (locationTextRef.current) locationTextRef.current.value = '';
            toast({ title: 'Error', description: result.error, variant: 'destructive' });
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            setIsSuggesting(true);
            setBreedSuggestions([]);
            const formData = new FormData();
            formData.append('image', file);
            const result = await getBreedSuggestions(formData);
            setIsSuggesting(false);

            if (result.error) {
                toast({ title: 'AI Suggestion', description: result.error, variant: 'destructive' });
            }
            if (result.suggestions) {
                setBreedSuggestions(result.suggestions);
                if (result.suggestions[0] && breedInputRef.current) {
                    breedInputRef.current.value = result.suggestions[0];
                }
            }
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setBreedSuggestions([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Laporan</DialogTitle>
                    <DialogDescription>
                        Ubah informasi laporan kucing Anda
                    </DialogDescription>
                </DialogHeader>
                <form
                    ref={formRef}
                    action={(formData) => {
                        if (location) {
                            formData.set('latitude', String(location.lat));
                            formData.set('longitude', String(location.lon));
                        }
                        // Keep existing imageUrl if no new image uploaded
                        if (!fileInputRef.current?.files?.[0] && cat.imageUrl) {
                            formData.set('imageUrl', cat.imageUrl);
                        }
                        formAction(formData);
                    }}
                    className="grid gap-6 py-4"
                >
                    <input type="hidden" name="latitude" value={location?.lat ?? ''} />
                    <input type="hidden" name="longitude" value={location?.lon ?? ''} />

                    <div className="space-y-2">
                        <Label htmlFor="edit-image-upload-button" className="text-sm font-medium">
                            Foto Kucing
                        </Label>
                        <div className="w-full aspect-video rounded-md border border-dashed flex items-center justify-center relative bg-muted/50 overflow-hidden">
                            {imagePreview ? (
                                <>
                                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 z-10 h-7 w-7"
                                        onClick={handleRemoveImage}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </>
                            ) : (
                                <div className="text-center text-muted-foreground p-4">
                                    <Camera className="mx-auto h-10 w-10 mb-2" />
                                    <p className="text-sm">Upload foto kucing</p>
                                </div>
                            )}
                        </div>
                        <Input
                            id="edit-image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            ref={fileInputRef}
                        />
                        <Button
                            id="edit-image-upload-button"
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imagePreview ? 'Ganti Foto' : 'Upload Foto'}
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Nama Kucing</Label>
                        <Input id="edit-name" name="name" defaultValue={cat.name} placeholder="Nama kucing" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-gender">Jenis Kelamin</Label>
                            <Select name="gender" defaultValue={cat.gender}>
                                <SelectTrigger id="edit-gender">
                                    <SelectValue placeholder="Pilih jenis kelamin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Jantan</SelectItem>
                                    <SelectItem value="Female">Betina</SelectItem>
                                    <SelectItem value="Unknown">Tidak Diketahui</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-type">Status</Label>
                            <Input id="edit-type" name="type" defaultValue={cat.type} placeholder="Hilang/Ditemukan" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-breed">Ras</Label>
                        <div className="relative">
                            <Input
                                id="edit-breed"
                                name="breed"
                                defaultValue={cat.breed}
                                placeholder="Ras kucing"
                                ref={breedInputRef}
                            />
                            {isSuggesting && (
                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                            )}
                        </div>
                        {breedSuggestions.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                                <p className="text-xs text-muted-foreground w-full mb-1">Saran AI:</p>
                                {breedSuggestions.map((breed) => (
                                    <Badge
                                        key={breed}
                                        variant="secondary"
                                        className="cursor-pointer hover:bg-accent"
                                        onClick={() => {
                                            if (breedInputRef.current) breedInputRef.current.value = breed;
                                        }}
                                    >
                                        {breed}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Lokasi Terakhir Terlihat</Label>
                        <LocationPicker
                            onLocationSelect={handleLocationSelect}
                        />
                        <Textarea
                            id="edit-locationText"
                            name="locationText"
                            ref={locationTextRef}
                            defaultValue={cat.locationText}
                            placeholder="Deskripsi lokasi"
                            readOnly={isGeocoding}
                            className="mt-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-contactInfo">Informasi Kontak (Opsional)</Label>
                        <Input
                            id="edit-contactInfo"
                            name="contactInfo"
                            defaultValue={cat.contactInfo || ''}
                            placeholder="No. HP atau cara menghubungi"
                        />
                    </div>

                    <SubmitButton />
                </form>
            </DialogContent>
        </Dialog>
    );
}
