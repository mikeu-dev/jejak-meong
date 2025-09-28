'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';

import type { Cat } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { PawPrint } from 'lucide-react';
import { Button } from './ui/button';

type CatMapProps = {
  cats: Cat[];
};

function CatMarkers({ cats }: { cats: Cat[] }) {
    const map = useMap();
    const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

    const selectedCat = useMemo(() => cats.find(c => c.id === selectedCatId), [cats, selectedCatId]);

    const handleMarkerClick = (cat: Cat) => {
        setSelectedCatId(cat.id);
        if (map) {
            map.panTo(cat.location);
        }
    }

    return <>
        {cats.map((cat) => (
          <AdvancedMarker
            key={cat.id}
            position={cat.location}
            onClick={() => handleMarkerClick(cat)}
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center transition-transform hover:scale-110">
                <PawPrint className="w-5 h-5 text-primary" />
            </div>
          </AdvancedMarker>
        ))}

        {selectedCat && (
          <InfoWindow
            position={selectedCat.location}
            onCloseClick={() => setSelectedCatId(null)}
            minWidth={250}
          >
            <div className="p-1">
              <Card className="border-none shadow-none w-64">
                <CardHeader className="p-0 mb-2">
                  <div className="aspect-video relative rounded-md overflow-hidden">
                    <Image src={selectedCat.imageUrl} data-ai-hint="cat" alt={selectedCat.name} fill className="object-cover" />
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-1.5">
                  <CardTitle className="text-lg font-bold">{selectedCat.name}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">{selectedCat.breed}</CardDescription>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <Badge variant="secondary">{selectedCat.gender}</Badge>
                    <Badge variant="secondary">{selectedCat.type}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </InfoWindow>
        )}
    </>
}

export function CatMap({ cats }: CatMapProps) {
  const defaultPosition = { lat: -6.2088, lng: 106.8456 }; // Jakarta

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <Map
          mapId="jejak-meong-map"
          style={{ width: '100%', height: '100%' }}
          defaultCenter={defaultPosition}
          defaultZoom={10}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
          zoomControl={true}
        >
          <CatMarkers cats={cats} />
        </Map>
      </APIProvider>
    </div>
  );
}
