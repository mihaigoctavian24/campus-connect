'use client';

import { useState, useEffect } from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { CookiePreferences } from '@/types/cookies';
import { X, Cookie, BarChart3, Target, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export function CookieSettings() {
  const { consent, settingsOpen, closeSettings, updatePreferences } = useCookieConsent();
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    if (consent?.preferences) {
      setPreferences(consent.preferences);
    }
  }, [consent]);

  if (!settingsOpen) return null;

  const handleSave = () => {
    updatePreferences(preferences);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <Cookie className="h-6 w-6 text-[#800020]" />
            <h2 className="text-xl font-bold text-[#001f3f]">Setări Cookie-uri</h2>
          </div>
          <button
            onClick={closeSettings}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          <p className="mb-6 text-sm text-gray-600">
            Personalizează ce tipuri de cookie-uri dorești să fie utilizate pe acest site.
            Cookie-urile esențiale sunt necesare pentru funcționarea platformei și nu pot fi
            dezactivate.
          </p>

          <div className="space-y-6">
            {/* Essential Cookies */}
            <div className="rounded-lg border-2 border-[#001f3f] bg-[#001f3f]/5 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 flex-shrink-0 text-[#001f3f]" />
                  <div>
                    <h3 className="mb-1 font-semibold text-[#001f3f]">
                      Cookie-uri Esențiale
                      <span className="ml-2 text-xs font-normal text-gray-500">
                        (Întotdeauna active)
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600">
                      Necesare pentru funcționarea de bază a platformei: autentificare, sesiuni,
                      securitate. Nu pot fi dezactivate.
                    </p>
                  </div>
                </div>
                <Switch checked={true} disabled className="opacity-50" />
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 flex-shrink-0 text-[#800020]" />
                  <div>
                    <h3 className="mb-1 font-semibold text-[#001f3f]">Cookie-uri Analitice</h3>
                    <p className="text-sm text-gray-600">
                      Ne ajută să înțelegem cum folosești platforma pentru a îmbunătăți experiența.
                      Colectăm date anonime despre paginile vizitate și timpul petrecut.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, analytics: checked }))
                  }
                  className="data-[state=unchecked]:bg-gray-300"
                />
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 flex-shrink-0 text-[#800020]" />
                  <div>
                    <h3 className="mb-1 font-semibold text-[#001f3f]">Cookie-uri Marketing</h3>
                    <p className="text-sm text-gray-600">
                      Utilizate pentru a personaliza conținutul și a afișa recomandări relevante.
                      Pot fi folosite de parteneri pentru analize de marketing.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, marketing: checked }))
                  }
                  className="data-[state=unchecked]:bg-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
            <p>
              Pentru mai multe informații despre modul în care folosim cookie-urile, consultă{' '}
              <a href="/cookies" className="text-[#800020] underline hover:text-[#a00828]">
                Politica de Cookie-uri
              </a>
              .
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 p-6">
          <Button variant="outline" onClick={closeSettings}>
            Anulează
          </Button>
          <Button onClick={handleSave} className="bg-[#800020] text-white hover:bg-[#a00828]">
            Salvează Preferințele
          </Button>
        </div>
      </div>
    </div>
  );
}
