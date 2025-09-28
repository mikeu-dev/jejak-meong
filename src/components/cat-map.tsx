'use client';
import 'ol/ol.css';
import { Map, View, Overlay } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Cat } from '@/lib/types';
import { useEffect, useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { MapPin } from 'lucide-react';
import { createRoot } from 'react-dom/client';

type CatMapProps = {
    cats: Cat[];
};

// A small React component for the map marker
const MapMarker = ({ cat, onClick }: { cat: Cat; onClick: (cat: Cat, coords: number[]) => void }) => {
    const coords = fromLonLat([cat.longitude, cat.latitude]);
    
    return (
        <div
            onClick={() => onClick(cat, coords)}
            className="w-16 h-16 rounded-full overflow-hidden border-4 border-primary/80 bg-background shadow-lg cursor-pointer transform hover:scale-110 transition-transform"
        >
            {cat.imageUrl ? (
                <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary">
                    <MapPin className="w-8 h-8 text-primary-foreground" />
                </div>
            )}
        </div>
    );
};


export function CatMap({ cats }: CatMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<Map | null>(null);
    const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
    const popoverOverlayRef = useRef<Overlay | null>(null);
    const popoverContentRef = useRef<HTMLDivElement>(null);


    // Effect to initialize the map
    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        const jakartaCoords = fromLonLat([106.8456, -6.2088]);

        const popoverElement = document.createElement('div');
        popoverElement.style.position = 'relative';

        const popoverOverlay = new Overlay({
            element: popoverElement,
            autoPan: {
                animation: {
                    duration: 250,
                },
            },
        });
        popoverOverlayRef.current = popoverOverlay;


        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: jakartaCoords,
                zoom: 10,
            }),
            overlays: [popoverOverlay],
            controls: [],
        });
        mapInstance.current = map;
        
        // Hide popover on map click
        map.on('click', () => {
             setSelectedCat(null);
        });


        return () => {
            if (mapInstance.current) {
                mapInstance.current.setTarget(undefined);
                mapInstance.current = null;
            }
        };
    }, []);

    // Effect to add cat markers to the map
    useEffect(() => {
        if (!mapInstance.current) return;

        // Clear previous overlays
        mapInstance.current.getOverlays().getArray()
            .filter(o => o.getElement()?.id.startsWith('marker-'))
            .forEach(o => mapInstance.current!.removeOverlay(o));

        const handleMarkerClick = (cat: Cat, coords: number[]) => {
            setSelectedCat(cat);
             if (popoverOverlayRef.current) {
                popoverOverlayRef.current.setPosition(coords);
            }
        };

        cats.forEach(cat => {
            if (!cat.longitude || !cat.latitude) return;

            const markerEl = document.createElement('div');
            markerEl.id = `marker-${cat.id}`;
            const root = createRoot(markerEl);
            root.render(<MapMarker cat={cat} onClick={handleMarkerClick} />);

            const overlay = new Overlay({
                position: fromLonLat([cat.longitude, cat.latitude]),
                element: markerEl,
                positioning: 'center-center',
                stopEvent: false, // Allow click events to propagate to the map
            });

            mapInstance.current?.addOverlay(overlay);
        });
    }, [cats, mapInstance]);
    
    return (
        <div className="w-full h-full relative">
            <div ref={mapRef} className="w-full h-full" />
             {selectedCat && (
                <Popover open={!!selectedCat} onOpenChange={(isOpen) => !isOpen && setSelectedCat(null)}>
                    <PopoverTrigger asChild>
                         {/* The Popover is now positioned by the OpenLayers Overlay, not by this trigger */}
                        <div ref={popoverContentRef} />
                    </PopoverTrigger>
                    <PopoverContent className="w-80" onOpenAutoFocus={(e) => e.preventDefault()}>
                        <div className="grid gap-4">
                             {selectedCat.imageUrl && (
                                <div className="aspect-video relative rounded-md overflow-hidden bg-muted">
                                    <Image src={selectedCat.imageUrl} alt={selectedCat.name} fill className="object-cover" />
                                </div>
                            )}
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold">{selectedCat.name}</h3>
                                <p className="text-sm text-muted-foreground">{selectedCat.breed}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">{selectedCat.gender}</Badge>
                                <Badge variant="secondary">{selectedCat.type}</Badge>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                <span>{selectedCat.locationText}</span>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
}
