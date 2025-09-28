'use client';

import { useState, useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Camera, Loader2, X } from 'lucide-react';

import { addCat, getBreedSuggestions, reverseGeocode } from '@/app/actions';
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

const initialState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="animate-spin" /> : 'Report Cat'}
    </Button>
  );
}

type AddCatFormProps = {
  onFormSuccess: () => void;
};

export function AddCatForm({ onFormSuccess }: AddCatFormProps) {
  const [formState, formAction] = useActionState(addCat, initialState);
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
      toast({
        title: formState.success ? 'Success!' : 'Error',
        description: formState.message,
        variant: formState.success ? 'default' : 'destructive',
      });
      if (formState.success) {
        formRef.current?.reset();
        setImagePreview(null);
        setBreedSuggestions([]);
        setLocation(null);
        onFormSuccess();
      }
    }
  }, [formState, toast, onFormSuccess]);
  
  const handleLocationSelect = async (coords: { lat: number; lon: number }) => {
    setLocation(coords);
    setIsGeocoding(true);
    if(locationTextRef.current) locationTextRef.current.value = 'Fetching address...';
    const result = await reverseGeocode(coords.lat, coords.lon);
    setIsGeocoding(false);
    if (result.address && locationTextRef.current) {
      locationTextRef.current.value = result.address;
    } else if (result.error) {
      if(locationTextRef.current) locationTextRef.current.value = '';
      toast({ title: 'Location Error', description: result.error, variant: 'destructive' });
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
        toast({ title: 'Breed Suggestion', description: result.error, variant: 'destructive' });
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
    <form ref={formRef} action={formAction} className="grid gap-6 py-4">
      <input type="hidden" name="latitude" value={location?.lat ?? ''} />
      <input type="hidden" name="longitude" value={location?.lon ?? ''} />

      <div className="space-y-2">
        <Label htmlFor="image-upload-button" className="text-sm font-medium">Cat Image</Label>
        <div className="w-full aspect-video rounded-md border border-dashed flex items-center justify-center relative bg-muted/50 overflow-hidden">
          {imagePreview ? (
            <>
              <Image src={imagePreview} alt="Cat preview" fill className="object-cover" />
              <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 z-10 h-7 w-7" onClick={handleRemoveImage}>
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="text-center text-muted-foreground p-4">
              <Camera className="mx-auto h-10 w-10 mb-2" />
              <p className="text-sm">Upload a picture of the cat</p>
            </div>
          )}
        </div>
        <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" ref={fileInputRef} />
        <Button id="image-upload-button" type="button" variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
          {imagePreview ? 'Change Image' : 'Upload Image'}
        </Button>
        {formState.errors?.image && <p className="text-sm font-medium text-destructive">{formState.errors.image[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Cat's Name</Label>
        <Input id="name" name="name" placeholder="e.g. Oyen, Cemong" />
        {formState.errors?.name && <p className="text-sm font-medium text-destructive">{formState.errors.name[0]}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select name="gender" defaultValue="Unknown">
            <SelectTrigger id="gender"><SelectValue placeholder="Select gender" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Input id="type" name="type" placeholder="e.g. Stray, Pet" />
          {formState.errors?.type && <p className="text-sm font-medium text-destructive">{formState.errors.type[0]}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="breed">Breed</Label>
        <div className="relative">
          <Input id="breed" name="breed" placeholder="e.g. Domestic Short Hair" ref={breedInputRef} />
          {isSuggesting && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        {formState.errors?.breed && <p className="text-sm font-medium text-destructive">{formState.errors.breed[0]}</p>}
        {breedSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            <p className="text-xs text-muted-foreground w-full mb-1">AI Suggestions (click to use):</p>
            {breedSuggestions.map(breed => (
              <Badge key={breed} variant="secondary" className="cursor-pointer hover:bg-accent" onClick={() => { if (breedInputRef.current) breedInputRef.current.value = breed; }}>
                {breed}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Last Seen Location</Label>
        <LocationPicker onLocationSelect={handleLocationSelect} />
        <Textarea
          id="locationText"
          name="locationText"
          ref={locationTextRef}
          placeholder="Click on the map to select a location..."
          readOnly={!isGeocoding}
          className="mt-2"
        />
        {formState.errors?.locationText && <p className="text-sm font-medium text-destructive">{formState.errors.locationText[0]}</p>}
      </div>
      <SubmitButton />
    </form>
  );
}
