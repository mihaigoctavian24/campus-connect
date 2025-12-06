'use client';

import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { Cookie, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CookieBanner() {
  const { showBanner, acceptAll, acceptEssential, openSettings } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Content */}
          <div className="flex items-start gap-3">
            <Cookie className="h-6 w-6 flex-shrink-0 text-[#800020]" />
            <div className="flex-1">
              <h3 className="mb-1 text-sm font-semibold text-[#001f3f]">Folosim Cookie-uri</h3>
              <p className="text-xs text-gray-600 sm:text-sm">
                Folosim cookie-uri pentru a îmbunătăți experiența ta și a analiza traficul pe site.
                Poți personaliza preferințele tale sau poți accepta toate cookie-urile.{' '}
                <a href="/cookies" className="text-[#800020] underline hover:text-[#a00828]">
                  Află mai multe
                </a>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={openSettings}
              className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Personalizează</span>
              <span className="sm:hidden">Setări</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={acceptEssential}
              className="border-[#001f3f] text-[#001f3f] hover:bg-[#001f3f] hover:text-white"
            >
              Doar Esențiale
            </Button>
            <Button
              size="sm"
              onClick={acceptAll}
              className="bg-[#800020] text-white hover:bg-[#a00828]"
            >
              Acceptă Toate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
