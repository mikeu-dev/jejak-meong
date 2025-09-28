import { Plus, PawPrint } from 'lucide-react';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Cat } from '@/lib/types';
import { CatList } from '@/components/cat-list';
import { AddCatSheet } from '@/components/add-cat-sheet';
import { Button } from '@/components/ui/button';

async function getCats(): Promise<Cat[]> {
  try {
    const catsCollection = collection(db, 'cats');
    const q = query(catsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
      } as unknown as Cat;
    });
  } catch (error) {
    console.error('Error fetching cats from Firestore:', error);
    return [];
  }
}

export default async function Home() {
  const cats = await getCats();

  return (
    <div className="flex flex-col h-svh w-screen">
      <header className="sticky top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm shadow-md">
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
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <CatList cats={cats} />
      </main>
    </div>
  );
}
