import { getAnalytics, logEvent, setUserProperties, Analytics } from 'firebase/analytics';
import { app } from './firebase';

let analytics: Analytics | null = null;

/**
 * Initialize Firebase Analytics
 * Hanya dijalankan di browser (client-side)
 */
export function initAnalytics(): Analytics | null {
    if (typeof window === 'undefined') {
        return null;
    }

    if (!analytics) {
        try {
            analytics = getAnalytics(app);
            console.log('✅ Firebase Analytics initialized');
        } catch (error) {
            console.error('Failed to initialize Firebase Analytics:', error);
        }
    }

    return analytics;
}

/**
 * Custom Events untuk tracking user behavior
 */
export const AnalyticsEvents = {
    // Cat reporting events
    CAT_REPORT_STARTED: 'cat_report_started',
    CAT_REPORT_COMPLETED: 'cat_report_completed',
    CAT_REPORT_FAILED: 'cat_report_failed',

    // Image events
    IMAGE_UPLOADED: 'image_uploaded',
    IMAGE_COMPRESSED: 'image_compressed',

    // Breed suggestion events
    BREED_SUGGESTION_REQUESTED: 'breed_suggestion_requested',
    BREED_SUGGESTION_SUCCESS: 'breed_suggestion_success',
    BREED_SUGGESTION_FAILED: 'breed_suggestion_failed',

    // Location events
    LOCATION_SELECTED: 'location_selected',
    GEOLOCATION_USED: 'geolocation_used',

    // View events
    CAT_LIST_VIEWED: 'cat_list_viewed',
    CAT_MAP_VIEWED: 'cat_map_viewed',
    CAT_DETAIL_VIEWED: 'cat_detail_viewed',

    // Search/Filter events
    CATS_FILTERED: 'cats_filtered',
    CATS_SEARCHED: 'cats_searched',
} as const;

/**
 * Log custom event ke Firebase Analytics
 */
export function trackEvent(
    eventName: string,
    params?: Record<string, any>
): void {
    const analyticsInstance = analytics || initAnalytics();

    if (!analyticsInstance) {
        return;
    }

    try {
        logEvent(analyticsInstance, eventName, params);
    } catch (error) {
        console.error('Failed to log analytics event:', error);
    }
}

/**
 * Set user properties untuk segmentasi
 */
export function setUserProperty(
    propertyName: string,
    value: string
): void {
    const analyticsInstance = analytics || initAnalytics();

    if (!analyticsInstance) {
        return;
    }

    try {
        setUserProperties(analyticsInstance, { [propertyName]: value });
    } catch (error) {
        console.error('Failed to set user property:', error);
    }
}

/**
 * Track cat report flow
 */
export function trackCatReport(stage: 'started' | 'completed' | 'failed', metadata?: Record<string, any>) {
    const eventMap = {
        started: AnalyticsEvents.CAT_REPORT_STARTED,
        completed: AnalyticsEvents.CAT_REPORT_COMPLETED,
        failed: AnalyticsEvents.CAT_REPORT_FAILED,
    };

    trackEvent(eventMap[stage], metadata);
}

/**
 * Track image upload
 */
export function trackImageUpload(metadata: {
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
}) {
    trackEvent(AnalyticsEvents.IMAGE_UPLOADED, metadata);
}

/**
 * Track breed suggestion
 */
export function trackBreedSuggestion(success: boolean, metadata?: Record<string, any>) {
    const event = success
        ? AnalyticsEvents.BREED_SUGGESTION_SUCCESS
        : AnalyticsEvents.BREED_SUGGESTION_FAILED;

    trackEvent(event, metadata);
}

/**
 * Track view changes
 */
export function trackViewChange(view: 'list' | 'map') {
    const event = view === 'list'
        ? AnalyticsEvents.CAT_LIST_VIEWED
        : AnalyticsEvents.CAT_MAP_VIEWED;

    trackEvent(event, { view });
}
