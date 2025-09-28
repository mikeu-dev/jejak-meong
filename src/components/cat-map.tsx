'use client';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
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

    useEffect(() => {
        if (!mapRef.current) return;

        const iconFeatures = cats.filter(cat => cat.latitude && cat.longitude).map(cat => {
            const feature = new Feature({
                geometry: new Point(fromLonLat([cat.longitude, cat.latitude])),
                catData: cat,
            });

            feature.setStyle(new Style({
                image: new Icon({
                    anchor: [0.5, 0.5],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    src: cat.imageUrl,
                    scale: 0.1, // Start small
                }),
            }));
            
            return feature;
        });

        const vectorSource = new VectorSource({
            features: iconFeatures,
        });

        const vectorLayer = new VectorLayer({
            source: vectorSource,
             style: (feature) => {
                const cat = feature.get('catData') as Cat;
                return new Style({
                    image: new CircleStyle({
                        radius: 30,
                        fill: new Fill({ color: '#ffffff' }),
                        stroke: new Stroke({ color: 'hsl(var(--primary))', width: 3 }),
                    }),
                });
            },
        });
        
        const jakartaCoords = fromLonLat([106.8456, -6.2088]);

        mapInstance.current = new Map({
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
        
        cats.forEach(cat => {
            if (!cat.imageUrl || !mapInstance.current) return;

            const markerElement = document.createElement('div');
            markerElement.className = 'w-16 h-16 rounded-full overflow-hidden border-4 border-primary/80 bg-background shadow-lg cursor-pointer transform hover:scale-110 transition-transform';
            markerElement.innerHTML = `<img src="${cat.imageUrl}" alt="${cat.name}" class="w-full h-full object-cover" />`;
            
            const point = new Point(fromLonLat([cat.longitude, cat.latitude]));

            const feature = new Feature({
                geometry: point,
                catData: cat,
            });
            
            feature.setStyle(new Style({
                image: new Icon({
                    anchor: [0.5, 0.5],
                    img: markerElement,
                    imgSize: [64, 64]
                }),
            }));

            vectorSource.addFeature(feature);
        });

        mapInstance.current.on('click', function(evt) {
            const feature = mapInstance.current?.forEachFeatureAtPixel(evt.pixel, function(feature) {
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

        return () => mapInstance.current?.setTarget(undefined);
    }, [cats]);
    
    useEffect(() => {
      if (popoverCoordinates && mapInstance.current) {
        const popoverElement = document.getElementById('cat-popover');
        if (popoverElement) {
            const pixel = mapInstance.current.getPixelFromCoordinate(popoverCoordinates);
            popoverElement.style.left = `${pixel[0]}px`;
            popoverElement.style.top = `${pixel[1]}px`;
        }
      }
    }, [popoverCoordinates]);

    return (
        <div className="w-full h-full relative">
            <div ref={mapRef} className="w-full h-full" />
             {selectedCat && popoverCoordinates && (
                <Popover open={!!selectedCat} onOpenChange={(isOpen) => !isOpen && setSelectedCat(null)}>
                    <PopoverTrigger asChild>
                        <div
                            id="cat-popover-trigger"
                            style={{
                                position: 'absolute',
                                left: `${mapInstance.current?.getPixelFromCoordinate(popoverCoordinates)[0]}px`,
                                top: `${mapInstance.current?.getPixelFromCoordinate(popoverCoordinates)[1] + 40}px`,
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
