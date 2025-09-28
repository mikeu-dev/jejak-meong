'use client';
import { Plus, PawPrint, List, Map as MapIcon } from 'lucide-react';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Cat } from '@/lib/types';
import { AddCatSheet } from '@/components/add-cat-sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CatList } from '@/components/cat-list';
import { CatMap } from '@/components/cat-map';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLanguage } from '@/context/language-context';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { AuthButton } from '@/components/auth-button';

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

export default function Home() {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCats() {
      setLoading(true);
      const fetchedCats = await getCats();
      setCats(fetchedCats);
      setLoading(false);
    }
    loadCats();
  }, []);

  return (
    <div className="flex flex-col h-svh w-screen">
      <header className="sticky top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm shadow-md">
        <div className="flex items-center gap-3">
          <PawPrint className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            {t('appName')}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <AuthButton />
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        <Tabs defaultValue="map" className="flex-1 flex flex-col">
          <div className="flex justify-center p-2 bg-background">
            <TabsList>
              <TabsTrigger value="map"><MapIcon className="mr-2 h-4 w-4"/>{t('mapView')}</TabsTrigger>
              <TabsTrigger value="list"><List className="mr-2 h-4 w-4"/>{t('listView')}</TabsTrigger>
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
