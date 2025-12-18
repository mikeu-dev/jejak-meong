'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface GeolocationData {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
}

interface GeolocationTrackerProps {
    onLocationUpdate: (location: GeolocationData) => void;
    autoStart?: boolean;
    showAccuracy?: boolean;
}

export function GeolocationTracker({
    onLocationUpdate,
    autoStart = false,
    showAccuracy = true,
}: GeolocationTrackerProps) {
    const [isTracking, setIsTracking] = useState(false);
    const [location, setLocation] = useState<GeolocationData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const startTracking = () => {
        if (!navigator.geolocation) {
            const errorMsg = 'Geolocation tidak didukung di browser Anda';
            setError(errorMsg);
            toast({
                title: 'Error',
                description: errorMsg,
                variant: 'destructive',
            });
            return;
        }

        setIsTracking(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const locationData: GeolocationData = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp,
                };

                setLocation(locationData);
                onLocationUpdate(locationData);
                setIsTracking(false);

                toast({
                    title: 'Lokasi Ditemukan',
                    description: `Akurasi: ${Math.round(locationData.accuracy)}m`,
                });
            },
            (error) => {
                let errorMsg = 'Gagal mendapatkan lokasi';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg = 'Izin lokasi ditolak. Mohon aktifkan izin lokasi di browser Anda.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMsg = 'Informasi lokasi tidak tersedia.';
                        break;
                    case error.TIMEOUT:
                        errorMsg = 'Waktu permintaan lokasi habis.';
                        break;
                }

                setError(errorMsg);
                setIsTracking(false);

                toast({
                    title: 'Error Lokasi',
                    description: errorMsg,
                    variant: 'destructive',
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    useEffect(() => {
        if (autoStart) {
            startTracking();
        }
    }, [autoStart]);

    return (
        <div className="space-y-2">
            <Button
                type="button"
                variant="outline"
                onClick={startTracking}
                disabled={isTracking}
                className="w-full"
            >
                {isTracking ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mencari lokasi...
                    </>
                ) : (
                    <>
                        <MapPin className="mr-2 h-4 w-4" />
                        Gunakan Lokasi Saya
                    </>
                )}
            </Button>

            {location && showAccuracy && (
                <div className="text-sm text-muted-foreground">
                    <p>📍 Lokasi ditemukan</p>
                    <p className="text-xs">
                        Akurasi: {Math.round(location.accuracy)}m
                        {location.accuracy > 100 && ' (Akurasi rendah, coba di luar ruangan)'}
                    </p>
                </div>
            )}

            {error && (
                <div className="text-sm text-destructive">
                    {error}
                </div>
            )}
        </div>
    );
}
