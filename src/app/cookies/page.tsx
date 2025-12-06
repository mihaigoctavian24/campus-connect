'use client';

import { Cookie, Shield, BarChart3, Target, Settings } from 'lucide-react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { Button } from '@/components/ui/button';

export default function CookiesPage() {
  const { openSettings } = useCookieConsent();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section with Animated Gradient */}
      <section
        id="hero-video-section"
        className="relative overflow-hidden px-4 py-12 sm:px-8 sm:py-20"
      >
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#001f3f] via-[#800020] via-30% to-[#001f3f] animate-gradient-shift bg-[length:400%_400%]" />

        {/* Animated Gold Accent Overlay */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.4),transparent_70%)] animate-pulse-slow" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Politica de Cookie-uri</h1>
          <p className="text-lg text-white/90 sm:text-xl">
            Cum folosim cookie-urile pentru a îmbunătăți experiența ta pe platformă
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8">
        {/* Settings CTA */}
        <div className="mb-12 rounded-lg bg-gradient-to-r from-[#001f3f] to-[#003566] p-6 text-white">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="mb-2 text-xl font-bold">Gestionează Preferințele</h2>
              <p className="text-white/90">
                Poți personaliza oricând ce tipuri de cookie-uri accepți.
              </p>
            </div>
            <Button
              onClick={openSettings}
              className="gap-2 bg-[#FFD700] text-[#001f3f] hover:bg-[#FFD700]/90"
            >
              <Settings className="h-5 w-5" />
              Setări Cookie-uri
            </Button>
          </div>
        </div>

        {/* Introduction */}
        <section className="mb-12">
          <div className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-sm">
            <Cookie className="h-8 w-8 flex-shrink-0 text-[#800020]" />
            <div>
              <h2 className="mb-3 text-2xl font-bold text-[#001f3f]">Ce sunt cookie-urile?</h2>
              <p className="mb-4 text-gray-700">
                Cookie-urile sunt fișiere mici de text stocate pe dispozitivul tău când vizitezi un
                site web. Ele ajută site-ul să își amintească informații despre vizita ta, făcând
                experiența mai rapidă și mai personalizată.
              </p>
              <p className="text-gray-700">
                CampusConnect folosește cookie-uri pentru a asigura funcționarea corectă a
                platformei, a îmbunătăți experiența utilizatorilor și a analiza modul de utilizare a
                serviciilor noastre.
              </p>
            </div>
          </div>
        </section>

        {/* Cookie Types */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">Tipuri de Cookie-uri Utilizate</h2>

          <div className="space-y-6">
            {/* Essential Cookies */}
            <div className="rounded-lg border-2 border-[#001f3f] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <Shield className="h-6 w-6 text-[#001f3f]" />
                <h3 className="text-xl font-semibold text-[#001f3f]">
                  1. Cookie-uri Esențiale
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    (Întotdeauna active)
                  </span>
                </h3>
              </div>
              <p className="mb-3 text-gray-700">
                Aceste cookie-uri sunt absolut necesare pentru funcționarea platformei și nu pot fi
                dezactivate în sistemele noastre.
              </p>
              <h4 className="mb-2 font-semibold text-[#001f3f]">Scopuri:</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                <li>Autentificarea utilizatorilor (păstrarea sesiunii de login)</li>
                <li>Securitatea platformei (protecție împotriva atacurilor CSRF)</li>
                <li>Preferințe de bază (limba selectată)</li>
                <li>Funcționarea coșului de aplicări</li>
              </ul>
              <p className="mt-3 text-xs text-gray-500">
                <strong>Durată:</strong> De la sesiune până la 1 an, în funcție de tip
              </p>
            </div>

            {/* Analytics Cookies */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-[#800020]" />
                <h3 className="text-xl font-semibold text-[#001f3f]">2. Cookie-uri Analitice</h3>
              </div>
              <p className="mb-3 text-gray-700">
                Aceste cookie-uri ne permit să numărăm vizitele și sursele de trafic pentru a măsura
                și îmbunătăți performanța site-ului nostru.
              </p>
              <h4 className="mb-2 font-semibold text-[#001f3f]">Ce măsurăm:</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                <li>Paginile cele mai vizitate</li>
                <li>Timpul petrecut pe platformă</li>
                <li>Parcursul utilizatorilor prin site</li>
                <li>Rate de conversie (aplicări la activități)</li>
                <li>Erori tehnice întâlnite de utilizatori</li>
              </ul>
              <p className="mt-3 text-xs text-gray-500">
                <strong>Durată:</strong> Până la 2 ani
              </p>
              <p className="mt-2 text-xs text-gray-500">
                <strong>Furnizori:</strong> Google Analytics, Sentry
              </p>
            </div>

            {/* Marketing Cookies */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <Target className="h-6 w-6 text-[#800020]" />
                <h3 className="text-xl font-semibold text-[#001f3f]">3. Cookie-uri Marketing</h3>
              </div>
              <p className="mb-3 text-gray-700">
                Aceste cookie-uri sunt folosite pentru a personaliza conținutul și a face
                recomandări relevante.
              </p>
              <h4 className="mb-2 font-semibold text-[#001f3f]">Utilizări:</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                <li>Recomandări personalizate de activități</li>
                <li>Afișarea oportunităților relevante pentru profilul tău</li>
                <li>Sugestii bazate pe interesele tale</li>
                <li>Comunicări targetate (dacă te-ai abonat)</li>
              </ul>
              <p className="mt-3 text-xs text-gray-500">
                <strong>Durată:</strong> Până la 1 an
              </p>
            </div>
          </div>
        </section>

        {/* How to Manage */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">Cum Gestionezi Cookie-urile?</h2>

          <div className="space-y-4">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-[#001f3f]">
                1. Prin Platformă (Recomandat)
              </h3>
              <p className="mb-3 text-gray-700">
                Folosește butonul "Setări Cookie-uri" de mai sus pentru a personaliza preferințele
                direct pe platformă. Alegerile tale vor fi salvate și respectate la viitoarele
                vizite.
              </p>
              <Button
                onClick={openSettings}
                variant="outline"
                className="gap-2 border-[#001f3f] text-[#001f3f]"
              >
                <Settings className="h-4 w-4" />
                Deschide Setări
              </Button>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-[#001f3f]">2. Prin Browser</h3>
              <p className="mb-3 text-gray-700">
                Majoritatea browserelor îți permit să controlezi cookie-urile prin setări. Poți:
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                <li>Șterge toate cookie-urile existente</li>
                <li>Blochează toate cookie-urile</li>
                <li>Permite doar cookie-uri de la anumite site-uri</li>
                <li>Șterge cookie-urile când închizi browserul</li>
              </ul>
              <p className="mt-3 text-sm text-gray-500">
                <strong>Notă:</strong> Blocarea tuturor cookie-urilor poate afecta funcționarea
                platformei (ex: nu vei putea să te autentifici).
              </p>
            </div>
          </div>
        </section>

        {/* Third Party */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">Cookie-uri Terțe Părți</h2>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="mb-4 text-gray-700">
              Pe lângă cookie-urile noastre, folosim și servicii de la terțe părți pentru analiză și
              funcționalitate:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-[#800020]">•</span>
                <div>
                  <strong className="text-[#001f3f]">Supabase:</strong>
                  <span className="text-gray-600">
                    {' '}
                    Pentru autentificare și baza de date (cookie-uri esențiale)
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#800020]">•</span>
                <div>
                  <strong className="text-[#001f3f]">Google Analytics:</strong>
                  <span className="text-gray-600">
                    {' '}
                    Pentru statistici de utilizare (cookie-uri analitice, opționale)
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#800020]">•</span>
                <div>
                  <strong className="text-[#001f3f]">Sentry:</strong>
                  <span className="text-gray-600">
                    {' '}
                    Pentru monitorizarea erorilor și îmbunătățirea performanței
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Updates */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">Actualizări Politică</h2>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-gray-700">
              Această politică de cookie-uri poate fi actualizată periodic pentru a reflecta
              schimbări în practicile noastre sau din motive legale. Te vom informa despre orice
              modificare semnificativă prin notificare pe platformă.
            </p>
            <p className="mt-3 text-sm text-gray-500">
              <strong>Ultima actualizare:</strong> Decembrie 2024
            </p>
          </div>
        </section>

        {/* Contact */}
        <section>
          <div className="rounded-lg bg-gradient-to-r from-[#001f3f] to-[#003566] p-8 text-center text-white">
            <h2 className="mb-3 text-2xl font-bold">Ai întrebări?</h2>
            <p className="mb-6 text-white/90">
              Dacă ai nelămuriri despre modul în care folosim cookie-urile, nu ezita să ne
              contactezi.
            </p>
            <a
              href="/contact"
              className="inline-block rounded-lg bg-[#FFD700] px-8 py-3 font-semibold text-[#001f3f] transition-transform hover:scale-105"
            >
              Contactează-ne
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
