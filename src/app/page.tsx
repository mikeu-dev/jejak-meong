import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Cat } from '@/lib/types';
import { PageHeader } from '@/components/page-header';
import { CatViews } from '@/components/cat-views';

async function getCats(): Promise<Cat[]> {
  try {
    const catsCollection = collection(db, 'cats');
    const q = query(catsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const latitude = data.location?.latitude || 0;
      const longitude = data.location?.longitude || 0;

      // Construct a plain object, excluding the original GeoPoint
      return {
        id: doc.id,
        name: data.name,
        gender: data.gender,
        type: data.type,
        breed: data.breed,
        imageUrl: data.imageUrl,
        locationText: data.locationText,
        // The location object is now a plain object
        location: { latitude, longitude },
        latitude, // Keep for direct access if needed
        longitude, // Keep for direct access if needed
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
      } as Cat;
    });
  } catch (error) {
    console.error('Error fetching cats from Firestore:', error);
    return [];
  }
}

export default async function Home() {
  // Fetch data on the server
  const cats = await getCats();

  return (
    <div className="flex flex-col h-svh w-screen">
      <PageHeader />
      <main className="flex-1 flex flex-col">
        <CatViews initialCats={cats} />
      </main>
    </div>
  );
}
