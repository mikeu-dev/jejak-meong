'use client';

import { useState, useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Camera, Loader2, X } from 'lucide-react';

import { addCat, getBreedSuggestions, reverseGeocode, type FormState } from '@/app/actions';
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
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { LocationPicker } from './location-picker';
import { useLanguage } from '@/context/language-context';
import { useAuth } from '@/context/auth-context';

const initialState: FormState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useLanguage();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="animate-spin" /> : t('submitReportButton')}
    </Button>
  );
}

type AddCatFormProps = {
  onFormSuccess: () => void;
};

export function AddCatForm({ onFormSuccess }: AddCatFormProps) {
  const { t, tError } = useLanguage();
  const { user } = useAuth();
  const [formState, formAction] = useActionState<FormState, FormData>(addCat, initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [breedSuggestions, setBreedSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
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
        title: isSuccess ? t('toastSuccessTitle') : t('toastErrorTitle'),
        description: tError(formState.message), // Use tError for potential error messages
        variant: isSuccess ? 'default' : 'destructive',
      });
      if (isSuccess) {
        formRef.current?.reset();
        setImagePreview(null);
        setBreedSuggestions([]);
        setLocation(null);
        onFormSuccess();
      }
    }
  }, [formState, toast, onFormSuccess, t, tError]);

  const handleLocationSelect = async (coords: { lat: number; lon: number }) => {
    setLocation(coords);
    setIsGeocoding(true);
    if (locationTextRef.current) locationTextRef.current.value = t('fetchingAddress');
    const result = await reverseGeocode(coords.lat, coords.lon);
    setIsGeocoding(false);
    if (result.address && locationTextRef.current) {
      locationTextRef.current.value = result.address;
    } else if (result.error) {
      if (locationTextRef.current) locationTextRef.current.value = '';
      toast({ title: t('toastLocationErrorTitle'), description: tError(result.error), variant: 'destructive' });
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
        toast({ title: t('toastBreedSuggestionTitle'), description: tError(result.error), variant: 'destructive' });
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
  }

  return (
    <form ref={formRef} action={(formData) => {
      if (location) {
        formData.set('latitude', String(location.lat));
        formData.set('longitude', String(location.lon));
      }
      // Add user data
      if (user) {
        formData.set('userId', user.uid);
        formData.set('userEmail', user.email || '');
        formData.set('userName', user.displayName || '');
        if (user.photoURL) {
          formData.set('userPhotoURL', user.photoURL);
        }
      }
      formAction(formData);
    }} className="grid gap-6 py-4">
      <input type="hidden" name="latitude" value={location?.lat ?? ''} />
      <input type="hidden" name="longitude" value={location?.lon ?? ''} />

      <div className="space-y-2">
        <Label htmlFor="image-upload-button" className="text-sm font-medium">{t('catImageLabel')}</Label>
        <div className="w-full aspect-video rounded-md border border-dashed flex items-center justify-center relative bg-muted/50 overflow-hidden">
          {imagePreview ? (
            <>
              <Image src={imagePreview} alt={t('catPreviewAlt')} fill className="object-cover" />
              <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 z-10 h-7 w-7" onClick={handleRemoveImage}>
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="text-center text-muted-foreground p-4">
              <Camera className="mx-auto h-10 w-10 mb-2" />
              <p className="text-sm">{t('uploadCatPicture')}</p>
            </div>
          )}
        </div>
        <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" ref={fileInputRef} />
        <Button id="image-upload-button" type="button" variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
          {imagePreview ? t('changeImageButton') : t('uploadImageButton')}
        </Button>
        {formState.errors?.image && <p className="text-sm font-medium text-destructive">{tError(formState.errors.image[0])}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">{t('catNameLabel')}</Label>
        <Input id="name" name="name" placeholder={t('catNamePlaceholder')} />
        {formState.errors?.name && <p className="text-sm font-medium text-destructive">{tError(formState.errors.name[0])}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">{t('genderLabel')}</Label>
          <Select name="gender" defaultValue="Unknown">
            <SelectTrigger id="gender"><SelectValue placeholder={t('genderPlaceholder')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">{t('genderMale')}</SelectItem>
              <SelectItem value="Female">{t('genderFemale')}</SelectItem>
              <SelectItem value="Unknown">{t('genderUnknown')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">{t('typeLabel')}</Label>
          <Input id="type" name="type" placeholder={t('typePlaceholder')} />
          {formState.errors?.type && <p className="text-sm font-medium text-destructive">{tError(formState.errors.type[0])}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="breed">{t('breedLabel')}</Label>
        <div className="relative">
          <Input id="breed" name="breed" placeholder={t('breedPlaceholder')} ref={breedInputRef} />
          {isSuggesting && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        {formState.errors?.breed && <p className="text-sm font-medium text-destructive">{tError(formState.errors.breed[0])}</p>}
        {breedSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            <p className="text-xs text-muted-foreground w-full mb-1">{t('aiSuggestions')}:</p>
            {breedSuggestions.map(breed => (
              <Badge key={breed} variant="secondary" className="cursor-pointer hover:bg-accent" onClick={() => { if (breedInputRef.current) breedInputRef.current.value = breed; }}>
                {breed}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>{t('lastSeenLocationLabel')}</Label>
        <LocationPicker onLocationSelect={handleLocationSelect} />
        <Textarea
          id="locationText"
          name="locationText"
          ref={locationTextRef}
          placeholder={t('locationPlaceholder')}
          readOnly={isGeocoding}
          className="mt-2"
        />
        {formState.errors?.locationText && <p className="text-sm font-medium text-destructive">{tError(formState.errors.locationText[0])}</p>}
      </div>
      <SubmitButton />
    </form>
  );
}
