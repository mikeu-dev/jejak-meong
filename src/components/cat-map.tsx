'use client';

import { Cat } from '@/lib/types';
import { Suspense, lazy } from 'react';
import { Skeleton } from './ui/skeleton';

// Lazy load the actual map component to reduce initial bundle size
const CatMapClient = lazy(() => import('./cat-map-client').then(mod => ({ default: mod.CatMapClient })));

type CatMapProps = {
    cats: Cat[];
};

function MapSkeleton() {
    return (
        <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-4 w-48" />
                <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
        </div>
    );
}

export function CatMap({ cats }: CatMapProps) {
    return (
        <Suspense fallback={<MapSkeleton />}>
            <CatMapClient cats={cats} />
        </Suspense>
    );
}
