import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PWAProvider } from '@/components/ui/PWAProvider';
import { PWAInstallPrompt } from '@/components/ui/PWAInstallPrompt';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Azan Noor — نور الأذان',
  description: 'Accurate Islamic prayer times, Azan, Qibla direction and daily Dua based on your location.',
  keywords: ['prayer times', 'azan', 'salah', 'qibla', 'Islamic', 'Muslim', 'dua', 'Ramadan'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Azan Noor',
  },
  openGraph: {
    title: 'Azan Noor',
    description: 'Daily prayer times, Azan, Qibla direction and Dua collection',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#10b981',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} h-full dark`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-full antialiased">
        <PWAProvider>
          {children}
          <PWAInstallPrompt />
        </PWAProvider>
      </body>
    </html>
  );
}
