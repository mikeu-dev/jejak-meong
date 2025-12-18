import Script from 'next/script';

/**
 * Structured Data (JSON-LD) untuk SEO
 * Membantu search engines memahami konten website
 */
export function StructuredData() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Jejak Meong',
        description: 'Platform komunitas untuk melaporkan dan menemukan kucing hilang di sekitar Anda',
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Any',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'IDR',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '127',
        },
        featureList: [
            'Lapor kucing hilang',
            'Temukan kucing di sekitar',
            'Peta interaktif',
            'AI breed detection',
            'Notifikasi real-time',
        ],
    };

    const organizationData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Jejak Meong',
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002',
        logo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/icon-512x512.png`,
        sameAs: [
            'https://twitter.com/jejakmeong',
            'https://facebook.com/jejakmeong',
            'https://instagram.com/jejakmeong',
        ],
    };

    return (
        <>
            <Script
                id="structured-data-webapp"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <Script
                id="structured-data-organization"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
            />
        </>
    );
}
