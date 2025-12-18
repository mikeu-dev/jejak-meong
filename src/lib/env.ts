import { z } from 'zod';

/**
 * Environment Variables Schema
 * Validates all required environment variables at runtime
 */
const envSchema = z.object({
    // Firebase Configuration (Required)
    NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, 'Firebase API Key is required'),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase Auth Domain is required'),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase Project ID is required'),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1, 'Firebase Storage Bucket is required'),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, 'Firebase Messaging Sender ID is required'),
    NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, 'Firebase App ID is required'),

    // Google AI (Required)
    GOOGLE_GENAI_API_KEY: z.string().min(1, 'Google Generative AI API Key is required'),

    // Optional Configuration
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
    NEXT_PUBLIC_MAX_IMAGE_SIZE_MB: z.coerce.number().positive().optional().default(5),
});

/**
 * Validates and parses environment variables
 * Throws an error if validation fails with detailed error messages
 */
function validateEnv() {
    try {
        const parsed = envSchema.parse({
            NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
            GOOGLE_GENAI_API_KEY: process.env.GOOGLE_GENAI_API_KEY,
            NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
            NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
            NEXT_PUBLIC_MAX_IMAGE_SIZE_MB: process.env.NEXT_PUBLIC_MAX_IMAGE_SIZE_MB,
        });

        return parsed;
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors.map(err => `  - ${err.path.join('.')}: ${err.message}`).join('\n');
            throw new Error(
                `❌ Environment variable validation failed:\n${errorMessages}\n\n` +
                `Please check your .env.local file and ensure all required variables are set.\n` +
                `See .env.example for reference.`
            );
        }
        throw error;
    }
}

/**
 * Validated environment variables
 * Type-safe and guaranteed to be present
 */
export const env = validateEnv();

/**
 * Type definition for environment variables
 */
export type Env = z.infer<typeof envSchema>;
