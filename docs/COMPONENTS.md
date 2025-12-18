# Components Documentation - Jejak Meong

Dokumentasi lengkap untuk semua React components di aplikasi Jejak Meong.

## Core Components

### `PageHeader`

Header utama aplikasi dengan logo, language switcher, theme toggle, dan auth button.

**Location:** `src/components/page-header.tsx`

**Props:** None

**Usage:**
```tsx
import { PageHeader } from '@/components/page-header';

<PageHeader />
```

---

### `CatViews`

Component untuk menampilkan daftar kucing dalam view list atau map.

**Location:** `src/components/cat-views.tsx`

**Props:**
```typescript
{
  initialCats: Cat[];  // Initial cat data dari server
}
```

**Usage:**
```tsx
import { CatViews } from '@/components/cat-views';

<CatViews initialCats={cats} />
```

---

### `AddCatSheet`

Sheet component untuk form tambah laporan kucing.

**Location:** `src/components/add-cat-sheet.tsx`

**Props:** None

**Usage:**
```tsx
import { AddCatSheet } from '@/components/add-cat-sheet';

<AddCatSheet />
```

---

## Form Components

### `AddCatForm`

Form untuk menambahkan laporan kucing baru.

**Location:** `src/components/add-cat-form.tsx`

**Props:**
```typescript
{
  onSuccess?: () => void;  // Callback saat submit berhasil
}
```

**Features:**
- Form validation dengan Zod
- Image upload dengan preview
- AI breed suggestion
- Location picker dengan map
- Real-time form state

**Usage:**
```tsx
import { AddCatForm } from '@/components/add-cat-form';

<AddCatForm onSuccess={() => console.log('Success!')} />
```

---

### `LocationPicker`

Interactive map untuk memilih lokasi.

**Location:** `src/components/location-picker.tsx`

**Props:**
```typescript
{
  onLocationSelect: (lat: number, lon: number, address: string) => void;
  initialLat?: number;
  initialLon?: number;
}
```

**Usage:**
```tsx
import { LocationPicker } from '@/components/location-picker';

<LocationPicker
  onLocationSelect={(lat, lon, address) => {
    console.log('Selected:', lat, lon, address);
  }}
  initialLat={-6.2088}
  initialLon={106.8456}
/>
```

---

## Feature Components

### `GeolocationTracker`

Component untuk mendapatkan lokasi user dengan geolocation API.

**Location:** `src/components/geolocation-tracker.tsx`

**Props:**
```typescript
{
  onLocationUpdate: (location: GeolocationData) => void;
  autoStart?: boolean;        // Auto-start tracking (default: false)
  showAccuracy?: boolean;     // Show accuracy indicator (default: true)
}
```

**GeolocationData:**
```typescript
{
  latitude: number;
  longitude: number;
  accuracy: number;           // Accuracy in meters
  timestamp: number;
}
```

**Usage:**
```tsx
import { GeolocationTracker } from '@/components/geolocation-tracker';

<GeolocationTracker
  onLocationUpdate={(location) => {
    console.log('Location:', location);
  }}
  autoStart={false}
  showAccuracy={true}
/>
```

---

### `CatComments`

Real-time comment system untuk setiap laporan kucing.

**Location:** `src/components/cat-comments.tsx`

**Props:**
```typescript
{
  catId: string;  // ID dokumen kucing di Firestore
}
```

**Features:**
- Real-time updates dengan Firestore onSnapshot
- Comment submission
- Timestamp dengan format relatif (e.g., "2 jam yang lalu")

**Usage:**
```tsx
import { CatComments } from '@/components/cat-comments';

<CatComments catId="cat-123" />
```

---

### `MultipleImageUpload`

Component untuk upload multiple images dengan preview dan compression.

**Location:** `src/components/multiple-image-upload.tsx`

**Props:**
```typescript
{
  maxImages?: number;                           // Max images (default: 5)
  onUploadComplete: (urls: string[]) => void;   // Callback dengan URLs
  onUploadProgress?: (progress: number) => void; // Progress callback (0-100)
}
```

**Features:**
- Multiple file selection
- Image preview grid
- Auto-compression sebelum upload
- Progress tracking
- Firebase Storage integration

**Usage:**
```tsx
import { MultipleImageUpload } from '@/components/multiple-image-upload';

<MultipleImageUpload
  maxImages={5}
  onUploadComplete={(urls) => {
    console.log('Uploaded URLs:', urls);
  }}
  onUploadProgress={(progress) => {
    console.log('Progress:', progress);
  }}
/>
```

---

### `StructuredData`

Component untuk menambahkan JSON-LD structured data untuk SEO.

**Location:** `src/components/structured-data.tsx`

**Props:** None

**Usage:**
```tsx
import { StructuredData } from '@/components/structured-data';

// Di layout.tsx
<body>
  <StructuredData />
  {children}
</body>
```

---

## Display Components

### `CatList`

Menampilkan daftar kucing dalam format list/grid.

**Location:** `src/components/cat-list.tsx`

**Props:**
```typescript
{
  cats: Cat[];
}
```

**Features:**
- Responsive grid layout
- Lazy loading images
- Cat detail modal/sheet

**Usage:**
```tsx
import { CatList } from '@/components/cat-list';

<CatList cats={cats} />
```

---

### `CatMap`

Menampilkan kucing dalam interactive map.

**Location:** `src/components/cat-map.tsx`

**Props:**
```typescript
{
  cats: Cat[];
}
```

**Features:**
- OpenLayers map integration
- Markers untuk setiap kucing
- Click untuk detail
- Zoom dan pan

**Usage:**
```tsx
import { CatMap } from '@/components/cat-map';

<CatMap cats={cats} />
```

---

## UI Components

Semua UI components berada di `src/components/ui/` dan menggunakan shadcn/ui.

### Commonly Used UI Components:

- `Button` - Button dengan variants
- `Input` - Text input field
- `Textarea` - Multi-line text input
- `Select` - Dropdown select
- `Dialog` - Modal dialog
- `Sheet` - Slide-in sheet
- `Toast` - Toast notifications
- `Card` - Card container
- `Avatar` - User avatar
- `Badge` - Status badge
- `Skeleton` - Loading skeleton

**Documentation:** [shadcn/ui docs](https://ui.shadcn.com/)

---

## Context Providers

### `ThemeProvider`

Provides theme (light/dark) functionality.

**Location:** `src/components/theme-provider.tsx`

**Usage:**
```tsx
import { ThemeProvider } from '@/components/theme-provider';

<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
>
  {children}
</ThemeProvider>
```

---

### `LanguageProvider`

Provides language switching (ID/EN).

**Location:** `src/context/language-context.tsx`

**Usage:**
```tsx
import { LanguageProvider, useLanguage } from '@/context/language-context';

// Provider
<LanguageProvider>
  {children}
</LanguageProvider>

// Consumer
const { language, setLanguage, t } = useLanguage();
```

---

### `AuthProvider`

Provides authentication state (future feature).

**Location:** `src/context/auth-context.tsx`

**Usage:**
```tsx
import { AuthProvider, useAuth } from '@/context/auth-context';

// Provider
<AuthProvider>
  {children}
</AuthProvider>

// Consumer
const { user, loading } = useAuth();
```

---

## Hooks

### `useToast`

Hook untuk menampilkan toast notifications.

**Location:** `src/hooks/use-toast.ts`

**Usage:**
```tsx
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

toast({
  title: 'Success',
  description: 'Operation completed',
  variant: 'default', // 'default' | 'destructive'
});
```

---

## Type Definitions

### `Cat`

```typescript
interface Cat {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Unknown';
  type: string;
  breed: string;
  imageUrl?: string;
  imageUrls?: string[];
  locationText: string;
  location: {
    latitude: number;
    longitude: number;
  };
  latitude: number;
  longitude: number;
  createdAt: string;
}
```

**Location:** `src/lib/types.ts`

---

## Best Practices

1. **Client Components:** Use `'use client'` directive untuk components yang menggunakan hooks atau browser APIs
2. **Server Components:** Default untuk components yang hanya render data
3. **Error Handling:** Selalu handle errors dengan try-catch dan toast notifications
4. **Loading States:** Tampilkan loading indicators untuk async operations
5. **Accessibility:** Gunakan semantic HTML dan ARIA labels
6. **Responsive:** Test di berbagai screen sizes
7. **Performance:** Lazy load images dan optimize bundle size
