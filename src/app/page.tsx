import { Plus, PawPrint } from 'lucide-react';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Cat } from '@/lib/types';
import { CatMap } from '@/components/cat-map';
import { AddCatSheet } from '@/components/add-cat-sheet';
import { Button } from '@/components/ui/button';

async function getCats(): Promise<Cat[]> {
  // Note: For production apps, fetching all documents isn't ideal.
  // Consider pagination or geo-based queries for better performance.
  try {
    const catsCollection = collection(db, 'cats');
    const q = query(catsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      // Firestore Timestamps need to be converted for Server Component -> Client Component serialization
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
      } as unknown as Cat;
    });
  } catch (error) {
    console.error('Error fetching cats from Firestore:', error);
    // In a real app, you might want to show a toast or an error message to the user.
    return [];
  }
}

export default async function Home() {
  const cats = await getCats();

  return (
    <div className="relative h-svh w-screen overflow-hidden">
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm shadow-md">
        <div className="flex items-center gap-3">
          <PawPrint className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            Jejak Meong
          </h1>
        </div>
        <AddCatSheet>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Report a Cat
          </Button>
        </AddCatSheet>
      </header>
      <main className="h-full w-full pt-[80px]">
        <CatMap cats={cats} />
      </main>
    </div>
  );
}
