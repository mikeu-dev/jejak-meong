# API Documentation - Jejak Meong

Dokumentasi lengkap untuk Server Actions dan Firebase structure di aplikasi Jejak Meong.

## Server Actions

### `addCat`

Menambahkan laporan kucing baru ke Firestore.

**Location:** `src/app/actions.ts`

**Parameters:**
- `prevState: FormState` - Previous form state
- `formData: FormData` - Form data containing:
  - `name: string` - Nama kucing (required)
  - `gender: 'Male' | 'Female' | 'Unknown'` - Jenis kelamin (required)
  - `type: string` - Tipe kucing (required)
  - `breed: string` - Ras kucing (required)
  - `locationText: string` - Alamat lokasi (required)
  - `latitude: number` - Latitude koordinat (required)
  - `longitude: number` - Longitude koordinat (required)
  - `imageUrl?: string` - URL gambar dari Firebase Storage (optional)
  - `imageUrls?: string` - JSON string array of image URLs (optional, max 5)

**Returns:** `Promise<FormState>`
```typescript
{
  success: boolean;
  message: string;
  errors?: {
    [key: string]: string[] | undefined;
  };
}
```

**Example:**
```typescript
const formData = new FormData();
formData.append('name', 'Fluffy');
formData.append('gender', 'Female');
formData.append('type', 'Domestic');
formData.append('breed', 'Persian');
formData.append('locationText', 'Jl. Sudirman No. 123');
formData.append('latitude', '-6.2088');
formData.append('longitude', '106.8456');
formData.append('imageUrl', 'https://firebasestorage.googleapis.com/...');

const result = await addCat(prevState, formData);
```

---

### `getBreedSuggestions`

Mendapatkan saran ras kucing menggunakan AI dari gambar.

**Location:** `src/app/actions.ts`

**Parameters:**
- `formData: FormData` - Form data containing:
  - `image: File` - File gambar kucing

**Returns:** `Promise<{ suggestions: string[]; error?: string }>`

**Example:**
```typescript
const formData = new FormData();
formData.append('image', imageFile);

const result = await getBreedSuggestions(formData);
if (result.suggestions.length > 0) {
  console.log('Suggested breeds:', result.suggestions);
}
```

---

### `reverseGeocode`

Mendapatkan alamat dari koordinat latitude/longitude.

**Location:** `src/app/actions.ts`

**Parameters:**
- `lat: number` - Latitude
- `lon: number` - Longitude

**Returns:** `Promise<{ address?: string; error?: string }>`

**Example:**
```typescript
const result = await reverseGeocode(-6.2088, 106.8456);
if (result.address) {
  console.log('Address:', result.address);
}
```

---

## Firebase Structure

### Firestore Collections

#### `cats` Collection

Document structure:
```typescript
{
  id: string;                    // Auto-generated document ID
  name: string;                  // Nama kucing
  gender: 'Male' | 'Female' | 'Unknown';
  type: string;                  // Tipe kucing (e.g., 'Domestic', 'Stray')
  breed: string;                 // Ras kucing
  locationText: string;          // Alamat dalam teks
  location: GeoPoint;            // Koordinat (latitude, longitude)
  imageUrl?: string;             // URL gambar utama (optional)
  imageUrls?: string[];          // Array URL gambar (optional, max 5)
  createdAt: Timestamp;          // Timestamp pembuatan
}
```

**Indexes Required:**
- `createdAt` (Descending) - untuk sorting by date

#### `cats/{catId}/comments` Subcollection

Document structure:
```typescript
{
  id: string;                    // Auto-generated document ID
  text: string;                  // Isi komentar
  userName: string;              // Nama user (default: 'Anonymous')
  userId?: string;               // User ID (optional, untuk future auth)
  createdAt: Timestamp;          // Timestamp pembuatan
}
```

**Indexes Required:**
- `createdAt` (Descending) - untuk sorting by date

---

### Firebase Storage Structure

```
/cats/{catId}/{imageId}.jpg     - Cat images
/users/{userId}/profile/{imageId}.jpg  - User profile images (future)
/temp/{filename}                - Temporary uploads
```

**File Naming Convention:**
- Cat images: `cat-{timestamp}-{random}.jpg`
- Generated using `generateImageFilename()` from `firebase-storage.ts`

---

## Utility Functions

### Firebase Storage (`src/lib/firebase-storage.ts`)

#### `compressImage(file, maxSizeMB, maxWidthOrHeight)`
Compress gambar sebelum upload.

**Parameters:**
- `file: File` - File gambar
- `maxSizeMB: number` - Ukuran maksimal dalam MB (default: 1)
- `maxWidthOrHeight: number` - Dimensi maksimal (default: 1920)

**Returns:** `Promise<File>`

#### `uploadImage(file, path, onProgress?)`
Upload single image ke Firebase Storage.

**Parameters:**
- `file: File` - File gambar
- `path: string` - Path di Storage
- `onProgress?: (progress: number) => void` - Callback progress (0-100)

**Returns:** `Promise<UploadResult>`

#### `uploadMultipleImages(files, basePath, onProgress?)`
Upload multiple images ke Firebase Storage.

**Parameters:**
- `files: File[]` - Array file gambar
- `basePath: string` - Base path di Storage
- `onProgress?: (progress: number) => void` - Callback overall progress

**Returns:** `Promise<UploadResult[]>`

---

### Firebase Analytics (`src/lib/firebase-analytics.ts`)

#### `trackEvent(eventName, params?)`
Log custom event ke Firebase Analytics.

**Example:**
```typescript
import { trackEvent, AnalyticsEvents } from '@/lib/firebase-analytics';

trackEvent(AnalyticsEvents.CAT_REPORT_COMPLETED, {
  catId: 'abc123',
  breed: 'Persian',
});
```

#### `trackCatReport(stage, metadata?)`
Track cat report flow.

**Stages:** `'started' | 'completed' | 'failed'`

---

### Notifications (`src/lib/notifications.ts`)

#### `requestNotificationPermission()`
Request notification permission dan dapatkan FCM token.

**Returns:** `Promise<string | null>` - FCM token atau null

#### `onMessageListener(callback)`
Listen untuk foreground messages.

**Returns:** `(() => void) | null` - Unsubscribe function

---

## Environment Variables

Required environment variables (see `.env.example`):

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Google AI (Genkit)
GOOGLE_GENAI_API_KEY=

# Optional
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_MAX_IMAGE_SIZE_MB=
```

---

## Error Handling

All server actions return a consistent error format:

```typescript
{
  success: false,
  message: string,  // User-friendly error message
  errors?: {        // Field-specific validation errors
    [key: string]: string[];
  }
}
```

Common error codes:
- `permission-denied` - Firestore security rules violation
- `validation-failed` - Input validation error
- `upload-failed` - Firebase Storage upload error
