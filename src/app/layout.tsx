import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import Providers from '@/components/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Libra',
  description: 'A modern, accessible interface for internal library systems.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen relative font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
