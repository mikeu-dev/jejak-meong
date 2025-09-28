'use client';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Icon, Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import { Cat } from '@/lib/types';
import { useEffect, useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { MapPin } from 'lucide-react';

type CatMapProps = {
    cats: Cat[];
};

export function CatMap({ cats }: CatMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<Map | null>(null);
    const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
    const [popoverCoordinates, setPopoverCoordinates] = useState<number[] | undefined>(undefined);
    const popoverTriggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const vectorSource = new VectorSource();

        const vectorLayer = new VectorLayer({
            source: vectorSource,
        });
        
        const jakartaCoords = fromLonLat([106.8456, -6.2088]);

        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                vectorLayer,
            ],
            view: new View({
                center: jakartaCoords,
                zoom: 10,
            }),
            controls: [],
        });
        mapInstance.current = map;
        
        cats.forEach(cat => {
            if (!cat.longitude || !cat.latitude) return;

            const point = new Point(fromLonLat([cat.longitude, cat.latitude]));

            const feature = new Feature({
                geometry: point,
                catData: cat,
            });
            
            let markerStyle;
            if (cat.imageUrl) {
                const markerElement = document.createElement('div');
                markerElement.className = 'w-16 h-16 rounded-full overflow-hidden border-4 border-primary/80 bg-background shadow-lg cursor-pointer transform hover:scale-110 transition-transform';
                markerElement.innerHTML = `<img src="${cat.imageUrl}" alt="${cat.name}" class="w-full h-full object-cover" />`;
                
                markerStyle = new Style({
                    image: new Icon({
                        anchor: [0.5, 0.5],
                        img: markerElement,
                        imgSize: [64, 64]
                    }),
                });
            } else {
                // Use a default marker if no image is available
                markerStyle = new Style({
                    image: new CircleStyle({
                        radius: 8,
                        fill: new Fill({ color: 'hsl(var(--primary))' }),
                        stroke: new Stroke({ color: 'hsl(var(--background))', width: 3 }),
                    }),
                });
            }

            feature.setStyle(markerStyle);
            vectorSource.addFeature(feature);
        });

        map.on('click', function(evt) {
            const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
                return feature;
            });
            
            if (feature) {
                const catData = feature.get('catData') as Cat;
                setSelectedCat(catData);
                const coordinates = (feature.getGeometry() as Point).getCoordinates();
                setPopoverCoordinates(coordinates);
            } else {
                setSelectedCat(null);
                setPopoverCoordinates(undefined);
            }
        });

        return () => {
            if (mapInstance.current) {
                mapInstance.current.setTarget(undefined);
            }
        };
    }, [cats]);
    
    useEffect(() => {
        if (popoverCoordinates && mapInstance.current && popoverTriggerRef.current) {
            const pixel = mapInstance.current.getPixelFromCoordinate(popoverCoordinates);
            if (pixel) {
                popoverTriggerRef.current.style.left = `${pixel[0]}px`;
                popoverTriggerRef.current.style.top = `${pixel[1]}px`;
            }
        }
    }, [popoverCoordinates, selectedCat]);

    const getPixel = (coords: number[]) => {
        if (!mapInstance.current) return null;
        return mapInstance.current.getPixelFromCoordinate(coords);
    }
    const currentPixel = popoverCoordinates ? getPixel(popoverCoordinates) : null;

    return (
        <div className="w-full h-full relative">
            <div ref={mapRef} className="w-full h-full" />
             {selectedCat && popoverCoordinates && currentPixel && (
                <Popover open={!!selectedCat} onOpenChange={(isOpen) => !isOpen && setSelectedCat(null)}>
                    <PopoverTrigger asChild>
                        <div
                            ref={popoverTriggerRef}
                            id="cat-popover-trigger"
                            style={{
                                position: 'absolute',
                                left: `${currentPixel ? currentPixel[0] : 0}px`,
                                top: `${currentPixel ? currentPixel[1] + 40 : 0}px`,
                                transform: 'translate(-50%, -100%)',
                            }}
                        />
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
