import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/context/language-context';
import { AuthProvider } from '@/context/auth-context';
import { StructuredData } from '@/components/structured-data';

export const metadata: Metadata = {
  title: {
    default: 'Jejak Meong - Lapor & Temukan Kucing Hilang',
    template: '%s | Jejak Meong',
  },
  description: 'Platform komunitas untuk melaporkan dan menemukan kucing hilang di sekitar Anda. Bantu kucing menemukan jalan pulang dengan Jejak Meong.',
  keywords: ['kucing hilang', 'lapor kucing', 'temukan kucing', 'pet finder', 'cat finder', 'jejak meong', 'komunitas kucing'],
  authors: [{ name: 'Jejak Meong Team' }],
  creator: 'Jejak Meong',
  publisher: 'Jejak Meong',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'),
  openGraph: {
    title: 'Jejak Meong - Lapor & Temukan Kucing Hilang',
    description: 'Platform komunitas untuk melaporkan dan menemukan kucing hilang di sekitar Anda. Bantu kucing menemukan jalan pulang dengan Jejak Meong.',
    url: '/',
    siteName: 'Jejak Meong',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jejak Meong - Platform Pencarian Kucing Hilang',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jejak Meong - Lapor & Temukan Kucing Hilang',
    description: 'Platform komunitas untuk melaporkan dan menemukan kucing hilang di sekitar Anda.',
    images: ['/og-image.png'],
    creator: '@jejakmeong',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,701&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased', 'bg-background text-foreground', 'overflow-hidden')}>
        <StructuredData />
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
