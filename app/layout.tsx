import type { Metadata } from 'next';
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plex-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PDF Teardowns',
  description: 'In-depth PDF teardowns and analyses',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${plexMono.variable} ${inter.variable}`}>
      <body className="bg-cream text-ink antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
