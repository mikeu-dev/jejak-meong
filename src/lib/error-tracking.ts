/**
 * Error Tracking Configuration
 * 
 * This module provides error tracking and monitoring capabilities for production.
 * Currently supports Sentry, but can be extended to support other services.
 * 
 * Usage:
 * 1. Set NEXT_PUBLIC_SENTRY_DSN in your environment variables
 * 2. Import and call initErrorTracking() in your app entry point
 * 3. Use captureError() to manually report errors
 */

interface ErrorTrackingConfig {
    dsn?: string;
    environment: string;
    enabled: boolean;
}

class ErrorTracking {
    private config: ErrorTrackingConfig;
    private initialized = false;

    constructor() {
        this.config = {
            dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
            environment: process.env.NODE_ENV || 'development',
            enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === 'production',
        };
    }

    /**
     * Initialize error tracking
     * Call this once at app startup
     */
    init() {
        if (this.initialized || !this.config.enabled) {
            return;
        }

        // TODO: Initialize Sentry or other error tracking service
        // Example for Sentry:
        // import * as Sentry from '@sentry/nextjs';
        // Sentry.init({
        //   dsn: this.config.dsn,
        //   environment: this.config.environment,
        //   tracesSampleRate: 1.0,
        // });

        this.initialized = true;
        console.log('[ErrorTracking] Initialized for environment:', this.config.environment);
    }

    /**
     * Capture an error
     * @param error - Error object or string
     * @param context - Additional context for the error
     */
    captureError(error: Error | string, context?: Record<string, any>) {
        if (!this.config.enabled) {
            console.error('[ErrorTracking] Error:', error, context);
            return;
        }

        // TODO: Send error to tracking service
        // Example for Sentry:
        // import * as Sentry from '@sentry/nextjs';
        // Sentry.captureException(error, { extra: context });

        console.error('[ErrorTracking] Captured error:', error, context);
    }

    /**
     * Capture a message (non-error event)
     * @param message - Message to capture
     * @param level - Severity level
     */
    captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
        if (!this.config.enabled) {
            console.log(`[ErrorTracking] ${level.toUpperCase()}:`, message);
            return;
        }

        // TODO: Send message to tracking service
        // Example for Sentry:
        // import * as Sentry from '@sentry/nextjs';
        // Sentry.captureMessage(message, level);

        console.log(`[ErrorTracking] Captured message [${level}]:`, message);
    }

    /**
     * Set user context for error tracking
     * @param user - User information
     */
    setUser(user: { id: string; email?: string; username?: string } | null) {
        if (!this.config.enabled) {
            return;
        }

        // TODO: Set user context in tracking service
        // Example for Sentry:
        // import * as Sentry from '@sentry/nextjs';
        // Sentry.setUser(user);

        console.log('[ErrorTracking] User context set:', user?.id);
    }
}

// Export singleton instance
export const errorTracking = new ErrorTracking();

// Convenience exports
export const initErrorTracking = () => errorTracking.init();
export const captureError = (error: Error | string, context?: Record<string, any>) =>
    errorTracking.captureError(error, context);
export const captureMessage = (message: string, level?: 'info' | 'warning' | 'error') =>
    errorTracking.captureMessage(message, level);
export const setErrorTrackingUser = (user: { id: string; email?: string; username?: string } | null) =>
    errorTracking.setUser(user);
