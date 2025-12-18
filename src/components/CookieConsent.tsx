'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const hasConsented = localStorage.getItem('cookie-consent');
        if (!hasConsented) {
            // Show banner after a short delay for better UX
            const timer = setTimeout(() => setShowBanner(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        localStorage.setItem('cookie-consent-date', new Date().toISOString());
        setShowBanner(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        localStorage.setItem('cookie-consent-date', new Date().toISOString());
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom duration-300">
            <div className="container mx-auto max-w-6xl">
                <div className="relative bg-background border border-border rounded-lg shadow-lg p-4 md:p-6">
                    <button
                        onClick={handleDecline}
                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
                        aria-label="Tutup"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    <div className="pr-8">
                        <h3 className="text-lg font-semibold mb-2">🍪 Cookie & Privasi</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Kami menggunakan cookies untuk meningkatkan pengalaman Anda, menganalisis penggunaan situs,
                            dan membantu dalam upaya pemasaran kami. Dengan mengklik "Terima", Anda menyetujui penggunaan cookies.
                            Pelajari lebih lanjut di{' '}
                            <Link href="/privacy" className="text-primary hover:underline">
                                Kebijakan Privasi
                            </Link>{' '}
                            kami.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <button
                                onClick={handleAccept}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                            >
                                Terima Semua
                            </button>
                            <button
                                onClick={handleDecline}
                                className="px-4 py-2 bg-muted text-muted-foreground rounded-md font-medium hover:bg-muted/80 transition-colors"
                            >
                                Tolak
                            </button>
                            <Link
                                href="/privacy"
                                className="px-4 py-2 text-center border border-border rounded-md font-medium hover:bg-muted transition-colors"
                            >
                                Pengaturan Cookie
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
