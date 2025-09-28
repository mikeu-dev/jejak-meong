import { Plus, PawPrint, List, Map as MapIcon } from 'lucide-react';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Cat } from '@/lib/types';
import { AddCatSheet } from '@/components/add-cat-sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CatList } from '@/components/cat-list';
import { CatMap } from '@/components/cat-map';

async function getCats(): Promise<Cat[]> {
  try {
    const catsCollection = collection(db, 'cats');
    const q = query(catsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      // Firestore GeoPoint needs to be destructured for serialization
      const latitude = data.location?.latitude || 0;
      const longitude = data.location?.longitude || 0;

      return {
        id: doc.id,
        ...data,
        latitude,
        longitude,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
      } as unknown as Cat;
    });
  } catch (error) {
    console.error('Error fetching cats from Firestore:', error);
    // Return empty array to prevent app crash, but log the error
    return [];
  }
}

export default async function Home() {
  const cats = await getCats();

  return (
    <div className="flex flex-col h-svh w-screen">
      <header className="sticky top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm shadow-md">
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
      <main className="flex-1 flex flex-col">
        <Tabs defaultValue="map" className="flex-1 flex flex-col">
          <div className="flex justify-center p-2 bg-background">
            <TabsList>
              <TabsTrigger value="map"><MapIcon className="mr-2 h-4 w-4"/>Map View</TabsTrigger>
              <TabsTrigger value="list"><List className="mr-2 h-4 w-4"/>List View</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="map" className="flex-1 -mt-2">
            <CatMap cats={cats} />
          </TabsContent>
          <TabsContent value="list" className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            <CatList cats={cats} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
