import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { app } from './firebase';

let messaging: Messaging | null = null;

/**
 * Initialize Firebase Cloud Messaging
 * Hanya dijalankan di browser (client-side)
 */
export function initMessaging(): Messaging | null {
    if (typeof window === 'undefined') {
        return null;
    }

    if (!messaging) {
        try {
            messaging = getMessaging(app);
            console.log('✅ Firebase Cloud Messaging initialized');
        } catch (error) {
            console.error('Failed to initialize Firebase Cloud Messaging:', error);
        }
    }

    return messaging;
}

/**
 * Request notification permission dan dapatkan FCM token
 */
export async function requestNotificationPermission(): Promise<string | null> {
    try {
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            console.log('Notification permission granted');

            const messagingInstance = messaging || initMessaging();
            if (!messagingInstance) {
                throw new Error('Messaging not initialized');
            }

            // Get FCM token
            // VAPID key harus di-generate di Firebase Console
            // Project Settings > Cloud Messaging > Web Push certificates
            const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

            if (!vapidKey) {
                console.warn('VAPID key not configured. Add NEXT_PUBLIC_FIREBASE_VAPID_KEY to .env.local');
                return null;
            }

            const token = await getToken(messagingInstance, { vapidKey });
            console.log('FCM Token:', token);

            return token;
        } else {
            console.log('Notification permission denied');
            return null;
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return null;
    }
}

/**
 * Listen untuk foreground messages
 */
export function onMessageListener(callback: (payload: any) => void): (() => void) | null {
    const messagingInstance = messaging || initMessaging();

    if (!messagingInstance) {
        return null;
    }

    const unsubscribe = onMessage(messagingInstance, (payload) => {
        console.log('Message received:', payload);
        callback(payload);
    });

    return unsubscribe;
}

/**
 * Show browser notification
 */
export function showNotification(title: string, options?: NotificationOptions) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, options);
    }
}

/**
 * Notification types untuk aplikasi Jejak Meong
 */
export const NotificationTypes = {
    NEW_CAT_NEARBY: 'new_cat_nearby',
    CAT_FOUND: 'cat_found',
    COMMENT_REPLY: 'comment_reply',
    SYSTEM_UPDATE: 'system_update',
} as const;

/**
 * Send notification to user (server-side function)
 * Ini harus dipanggil dari server action atau API route
 */
export async function sendNotificationToUser(
    fcmToken: string,
    notification: {
        title: string;
        body: string;
        type?: string;
        data?: Record<string, string>;
    }
) {
    // This function should be called from server-side
    // Implementation requires Firebase Admin SDK
    console.log('Send notification:', { fcmToken, notification });

    // TODO: Implement server-side notification sending
    // using Firebase Admin SDK in a server action or API route
}
