# Testing Guide - Jejak Meong

Panduan untuk setup testing framework di aplikasi Jejak Meong.

## Recommended Testing Stack

- **Vitest** - Fast unit test framework
- **React Testing Library** - Component testing
- **Playwright** - E2E testing (optional)

## Setup Vitest (Unit Testing)

### 1. Install Dependencies

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### 2. Create `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 3. Create Test Setup File

Create `src/__tests__/setup.ts`:

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

### 4. Update `package.json` Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage"
  }
}
```

## Writing Tests

### Example: Testing Server Actions

Create `src/__tests__/actions.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { addCat } from '@/app/actions';

describe('addCat', () => {
  it('should validate required fields', async () => {
    const formData = new FormData();
    const result = await addCat({ success: false, message: '' }, formData);
    
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('should accept valid cat data', async () => {
    const formData = new FormData();
    formData.append('name', 'Fluffy');
    formData.append('gender', 'Female');
    formData.append('type', 'Domestic');
    formData.append('breed', 'Persian');
    formData.append('locationText', 'Jakarta');
    formData.append('latitude', '-6.2088');
    formData.append('longitude', '106.8456');
    
    const result = await addCat({ success: false, message: '' }, formData);
    
    // Note: This will fail without proper Firebase mock
    // See Firebase Mocking section below
  });
});
```

### Example: Testing Components

Create `src/__tests__/components/GeolocationTracker.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GeolocationTracker } from '@/components/geolocation-tracker';

describe('GeolocationTracker', () => {
  it('should render button', () => {
    const mockCallback = vi.fn();
    render(<GeolocationTracker onLocationUpdate={mockCallback} />);
    
    expect(screen.getByText(/Gunakan Lokasi Saya/i)).toBeInTheDocument();
  });

  it('should call onLocationUpdate when location is found', async () => {
    const mockCallback = vi.fn();
    const mockGeolocation = {
      getCurrentPosition: vi.fn((success) => {
        success({
          coords: {
            latitude: -6.2088,
            longitude: 106.8456,
            accuracy: 10,
          },
          timestamp: Date.now(),
        });
      }),
    };
    
    // @ts-ignore
    global.navigator.geolocation = mockGeolocation;
    
    render(<GeolocationTracker onLocationUpdate={mockCallback} />);
    
    const button = screen.getByText(/Gunakan Lokasi Saya/i);
    fireEvent.click(button);
    
    expect(mockCallback).toHaveBeenCalled();
  });
});
```

## Firebase Mocking

### Option 1: Mock Firebase Modules

Create `src/__tests__/mocks/firebase.ts`:

```typescript
import { vi } from 'vitest';

export const mockFirestore = {
  collection: vi.fn(),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
};

export const mockStorage = {
  ref: vi.fn(),
  uploadBytesResumable: vi.fn(),
  getDownloadURL: vi.fn(),
};

vi.mock('@/lib/firebase', () => ({
  db: mockFirestore,
  storage: mockStorage,
  auth: {},
  app: {},
}));
```

### Option 2: Use Firebase Emulator

1. Install Firebase Emulator:
```bash
npm install -g firebase-tools
firebase init emulators
```

2. Start emulator:
```bash
firebase emulators:start
```

3. Configure tests to use emulator:
```typescript
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectStorageEmulator } from 'firebase/storage';

if (process.env.NODE_ENV === 'test') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}
```

## E2E Testing dengan Playwright (Optional)

### 1. Install Playwright

```bash
npm init playwright@latest
```

### 2. Example E2E Test

Create `e2e/cat-report.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('should submit cat report', async ({ page }) => {
  await page.goto('http://localhost:9002');
  
  // Open add cat sheet
  await page.click('button:has-text("Lapor Kucing")');
  
  // Fill form
  await page.fill('input[name="name"]', 'Test Cat');
  await page.selectOption('select[name="gender"]', 'Female');
  await page.fill('input[name="type"]', 'Domestic');
  await page.fill('input[name="breed"]', 'Persian');
  
  // Submit
  await page.click('button[type="submit"]');
  
  // Verify success
  await expect(page.locator('text=berhasil')).toBeVisible();
});
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npx playwright test

# Run E2E tests in UI mode
npx playwright test --ui
```

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type check
        run: npm run typecheck
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
```

## Best Practices

1. **Test Coverage:** Aim for >80% coverage untuk critical paths
2. **Mock External Services:** Mock Firebase, API calls, dll
3. **Test User Flows:** Focus on user interactions
4. **Fast Tests:** Keep unit tests fast (<100ms each)
5. **Isolated Tests:** Each test should be independent
6. **Descriptive Names:** Use clear test descriptions
7. **AAA Pattern:** Arrange, Act, Assert

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Firebase Emulator](https://firebase.google.com/docs/emulator-suite)
