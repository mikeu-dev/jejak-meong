'use client';

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { List, Map as MapIcon } from 'lucide-react';
import { CatList } from '@/components/cat-list';
import { CatMap } from '@/components/cat-map';
import { CatSearch } from '@/components/cat-search';
import { CatFiltersComponent, type CatFilters } from '@/components/cat-filters';
import { CatSort, type SortOption } from '@/components/cat-sort';
import { useLanguage } from '@/context/language-context';
import type { Cat } from '@/lib/types';

interface CatViewsProps {
    initialCats: Cat[];
}

export function CatViews({ initialCats }: CatViewsProps) {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<CatFilters>({
        status: [],
        gender: [],
        type: [],
    });
    const [sortBy, setSortBy] = useState<SortOption>('newest');

    // Filter and sort cats
    const filteredAndSortedCats = useMemo(() => {
        let result = [...initialCats];

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(cat =>
                cat.name.toLowerCase().includes(query) ||
                cat.breed.toLowerCase().includes(query) ||
                cat.locationText.toLowerCase().includes(query) ||
                cat.type.toLowerCase().includes(query)
            );
        }

        // Apply filters
        if (filters.status.length > 0) {
            result = result.filter(cat => filters.status.includes(cat.status || 'active'));
        }
        if (filters.gender.length > 0) {
            result = result.filter(cat => filters.gender.includes(cat.gender));
        }
        if (filters.type.length > 0) {
            result = result.filter(cat => filters.type.includes(cat.type));
        }

        // Apply sorting
        result.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'oldest':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });

        return result;
    }, [initialCats, searchQuery, filters, sortBy]);

    return (
        <Tabs defaultValue="map" className="flex-1 flex flex-col">
            <div className="flex flex-col gap-3 p-4 bg-background border-b">
                {/* Search Bar */}
                <CatSearch onSearch={setSearchQuery} />

                {/* Filter and Sort Controls */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <CatFiltersComponent
                        filters={filters}
                        onFiltersChange={setFilters}
                    />
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Menampilkan {filteredAndSortedCats.length} dari {initialCats.length} laporan
                        </span>
                        <CatSort sortBy={sortBy} onSortChange={setSortBy} />
                    </div>
                </div>

                {/* View Tabs */}
                <TabsList className="w-fit mx-auto">
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

            <TabsContent value="map" className="flex-1 mt-0">
                <CatMap cats={filteredAndSortedCats} />
            </TabsContent>
            <TabsContent value="list" className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 mt-0">
                <CatList cats={filteredAndSortedCats} />
            </TabsContent>
        </Tabs>
    );
}
