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
import { Style, Icon } from 'ol/style';
import { useEffect, useRef } from 'react';

type LocationPickerProps = {
  onLocationSelect: (coords: { lat: number; lon: number }) => void;
};

export function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const markerRef = useRef<Feature | null>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    
    const jakartaCoords = fromLonLat([106.8456, -6.2088]);

    vectorSourceRef.current = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSourceRef.current,
    });

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
        zoom: 12,
      }),
      controls: [],
    });

    mapInstance.current.on('click', (evt) => {
      const lonLat = toLonLat(evt.coordinate);

      if (!markerRef.current) {
        markerRef.current = new Feature({
          geometry: new Point(evt.coordinate),
        });
        markerRef.current.setStyle(new Style({
          image: new Icon({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          })
        }));
        vectorSourceRef.current?.addFeature(markerRef.current);
      } else {
        markerRef.current.getGeometry()?.setCoordinates(evt.coordinate);
      }

      onLocationSelect({ lat: lonLat[1], lon: lonLat[0] });
    });

    return () => mapInstance.current?.setTarget(undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mapRef} className="w-full h-64 rounded-md border" />;
}
