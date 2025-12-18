import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { redirect } from 'next/navigation';
import { db } from '@/lib/firebase';
import type { Cat } from '@/lib/types';
import { UserProfile } from '@/components/user-profile';
import { UserReportsList } from '@/components/user-reports-list';
import { cookies } from 'next/headers';

// This is a server component
export default async function ProfilePage() {
    // Note: We can't access Firebase Auth directly in server components
    // We'll need to pass user info from client or use a different approach
    // For now, we'll create a client wrapper

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Profil Saya</h1>
            <UserProfile />
        </div>
    );
}
