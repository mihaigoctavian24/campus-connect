import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { HeaderWrapper } from '@/components/layout/HeaderWrapper';
import { Footer } from '@/components/layout/Footer';
import { NotificationProvider } from '@/lib/contexts/NotificationContext';
import { CookieConsentProvider } from '@/contexts/CookieConsentContext';
import { CookieBanner } from '@/components/cookies/CookieBanner';
import { CookieSettings } from '@/components/cookies/CookieSettings';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Campus Connect - Hub Voluntariat Universitar',
  description: 'Platform pentru gestionarea activităților de voluntariat studenţesc',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <CookieConsentProvider>
          <NotificationProvider>
            <HeaderWrapper />
            <main className="flex-1">{children}</main>
            <Footer />
            <CookieBanner />
            <CookieSettings />
          </NotificationProvider>
        </CookieConsentProvider>
      </body>
    </html>
  );
}
