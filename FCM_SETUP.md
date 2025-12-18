# Jejak Meong - Firebase Cloud Messaging Setup

File ini berisi instruksi untuk setup Firebase Cloud Messaging (FCM) untuk push notifications.

## Prerequisites

1. Firebase project sudah dibuat
2. Firebase SDK sudah terinstall
3. Service Worker sudah dikonfigurasi

## Setup Steps

### 1. Generate VAPID Key

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Pilih project Anda
3. Navigasi ke **Project Settings** > **Cloud Messaging**
4. Scroll ke **Web Push certificates**
5. Klik **Generate key pair**
6. Copy VAPID key yang di-generate

### 2. Add VAPID Key to Environment Variables

Tambahkan ke file `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key-here
```

### 3. Create Service Worker

Buat file `public/firebase-messaging-sw.js`:

```javascript
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background Message:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

### 4. Request Permission

Gunakan utility function `requestNotificationPermission()` dari `src/lib/notifications.ts`:

```typescript
import { requestNotificationPermission } from '@/lib/notifications';

// Request permission dan dapatkan FCM token
const token = await requestNotificationPermission();
if (token) {
  // Save token ke database untuk mengirim notifikasi nanti
  console.log('FCM Token:', token);
}
```

### 5. Listen for Messages

```typescript
import { onMessageListener } from '@/lib/notifications';

// Listen untuk foreground messages
const unsubscribe = onMessageListener((payload) => {
  console.log('Message received:', payload);
  // Show notification atau update UI
});

// Cleanup
return () => unsubscribe?.();
```

## Testing

### Test di Development

1. Request notification permission
2. Copy FCM token dari console
3. Gunakan Firebase Console untuk send test message:
   - Navigasi ke **Cloud Messaging** > **Send your first message**
   - Paste FCM token
   - Send message

### Test di Production

1. Implement server-side notification sending menggunakan Firebase Admin SDK
2. Trigger notification dari server action atau API route

## Notes

- Notifications hanya bekerja di HTTPS (atau localhost untuk development)
- Service Worker harus di-register di root domain
- FCM token dapat expire, implement token refresh logic
- Store FCM tokens di database untuk mengirim targeted notifications

## Troubleshooting

### Permission Denied
- Check browser notification settings
- Ensure HTTPS is enabled
- Clear browser cache and try again

### Service Worker Not Registered
- Check `firebase-messaging-sw.js` is in `public/` folder
- Verify service worker registration in browser DevTools > Application > Service Workers

### Token Not Generated
- Verify VAPID key is correct
- Check Firebase project configuration
- Ensure all Firebase credentials are correct
