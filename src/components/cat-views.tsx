'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { List, Map as MapIcon } from 'lucide-react';
import { CatList } from '@/components/cat-list';
import { CatMap } from '@/components/cat-map';
import { useLanguage } from '@/context/language-context';
import type { Cat } from '@/lib/types';

interface CatViewsProps {
    initialCats: Cat[];
}

export function CatViews({ initialCats }: CatViewsProps) {
    const { t } = useLanguage();

    return (
        <Tabs defaultValue="map" className="flex-1 flex flex-col">
            <div className="flex justify-center p-2 bg-background">
                <TabsList>
                    <TabsTrigger value="map">
                        <MapIcon className="mr-2 h-4 w-4" />
                        {t('mapView')}
                    </TabsTrigger>
                    <TabsTrigger value="list">
                        <List className="mr-2 h-4 w-4" />
                        {t('listView')}
                    </TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="map" className="flex-1 -mt-2">
                <CatMap cats={initialCats} />
            </TabsContent>
            <TabsContent value="list" className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                <CatList cats={initialCats} />
            </TabsContent>
        </Tabs>
    );
}
