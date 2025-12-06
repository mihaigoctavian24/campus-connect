'use client';

import {
  BarChart3,
  Calendar,
  CheckCircle,
  FileText,
  PlusCircle,
  QrCode,
  Settings,
  Users,
} from 'lucide-react';

export default function ProfessorGuidePage() {
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
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Ghid pentru Profesori</h1>
          <p className="text-lg text-white/90 sm:text-xl">
            Totul despre crearea și gestionarea activităților de voluntariat
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-8">
        {/* Creating Activities */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">Creare Activități</h2>
          <div className="space-y-6">
            <div className="rounded-lg border-l-4 border-[#FFD700] bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <PlusCircle className="h-6 w-6 flex-shrink-0 text-[#001f3f]" />
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-[#001f3f]">Informații de Bază</h3>
                  <p className="mb-3 text-gray-700">
                    Titlu descriptiv, descriere detaliată a activității, categorie (Mediu, Educație,
                    Social, Sănătate), departamentul coordonator.
                  </p>
                  <div className="rounded bg-gray-50 p-3 text-sm text-gray-600">
                    <strong>Sfat:</strong> Un titlu clar și o descriere detaliată cresc șansele de
                    aplicare cu 60%.
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border-l-4 border-[#FFD700] bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <Calendar className="h-6 w-6 flex-shrink-0 text-[#001f3f]" />
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-[#001f3f]">
                    Planificare & Logistică
                  </h3>
                  <p className="text-gray-700">
                    Număr total de ore necesare, număr maxim de participanți, locația (fizică sau
                    online), perioada de desfășurare, cerințe speciale pentru studenți.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border-l-4 border-[#FFD700] bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <Settings className="h-6 w-6 flex-shrink-0 text-[#001f3f]" />
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-[#001f3f]">Setări Avansate</h3>
                  <p className="text-gray-700">
                    Aprobare automată/manuală, limite de absențe, campuri personalizate în
                    formularul de aplicare, notificări automate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Managing Applications */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">Gestionare Aplicații</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <Users className="mb-4 h-8 w-8 text-[#800020]" />
              <h3 className="mb-3 text-lg font-semibold text-[#001f3f]">Review Aplicații</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>Primești notificare pentru fiecare aplicare nouă</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>Vezi profilul studentului și motivația acestuia</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>Aprobă sau respinge cu un click</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>Studenții primesc notificare automată</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <Calendar className="mb-4 h-8 w-8 text-[#800020]" />
              <h3 className="mb-3 text-lg font-semibold text-[#001f3f]">Planificare Sesiuni</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>Creează sesiuni cu date, ore și locații specifice</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>QR code generat automat pentru fiecare sesiune</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>Modifică sau anulează sesiuni cu notificări auto</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>Export calendar pentru integrare (Google, Outlook)</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Attendance Management */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">Validare Prezență</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg bg-gradient-to-br from-[#001f3f] to-[#003566] p-6 text-white">
              <QrCode className="mb-4 h-10 w-10" />
              <h3 className="mb-3 text-xl font-semibold">QR Code Automat</h3>
              <p className="mb-4 text-white/90">
                Afișează QR code-ul sesiunii pe ecran sau printează-l. Studenții scanează cu
                telefonul și prezența e marcată instant.
              </p>
              <div className="rounded bg-white/10 p-3 text-sm">
                <strong>Avantaj:</strong> Zero administrare manuală, nicio eroare de transcriere.
              </div>
            </div>

            <div className="rounded-lg bg-gradient-to-br from-[#800020] to-[#a00828] p-6 text-white">
              <CheckCircle className="mb-4 h-10 w-10" />
              <h3 className="mb-3 text-xl font-semibold">Validare Manuală</h3>
              <p className="mb-4 text-white/90">
                Pentru situații speciale, poți marca manual prezența din lista participanților
                înscriși.
              </p>
              <div className="rounded bg-white/10 p-3 text-sm">
                <strong>Util pentru:</strong> Probleme tehnice, studenți fără smartphone, validare
                retrospectivă.
              </div>
            </div>
          </div>
        </section>

        {/* Reports & Analytics */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">Rapoarte & Statistici</h2>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-[#001f3f]" />
              <h3 className="text-xl font-semibold text-[#001f3f]">Dashboard Analitice</h3>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="mb-2 text-2xl font-bold text-[#001f3f]">Prezență</div>
                <p className="text-sm text-gray-600">
                  Rate de participare, absențe, studenți activi vs. inactivi
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <div className="mb-2 text-2xl font-bold text-[#800020]">Ore Validate</div>
                <p className="text-sm text-gray-600">
                  Total ore acumulate, distribuție pe studenți, progres față de target
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <div className="mb-2 text-2xl font-bold text-[#4a5568]">Feedback</div>
                <p className="text-sm text-gray-600">
                  Rating mediu, comentarii studenți, sugestii de îmbunătățire
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-lg border-2 border-dashed border-[#FFD700] bg-[#FFD700]/5 p-4">
              <FileText className="mb-2 h-6 w-6 text-[#001f3f]" />
              <h4 className="mb-2 font-semibold text-[#001f3f]">Export Rapoarte</h4>
              <p className="text-sm text-gray-600">
                Descarcă rapoarte complete în format PDF sau Excel pentru evidențele departamentului
                sau instituției.
              </p>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">Bune Practici</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#FFD700] text-sm font-bold text-[#001f3f]">
                ✓
              </div>
              <div>
                <h4 className="font-semibold text-[#001f3f]">Comunică Clar Așteptările</h4>
                <p className="text-sm text-gray-600">
                  Specifică clar în descriere ce vor face studenții, ce skills vor dezvolta și care
                  sunt responsabilitățile lor.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#FFD700] text-sm font-bold text-[#001f3f]">
                ✓
              </div>
              <div>
                <h4 className="font-semibold text-[#001f3f]">Răspunde Prompt la Aplicații</h4>
                <p className="text-sm text-gray-600">
                  Studenții engajați apreciază feedback-ul rapid. Încearcă să răspunzi în maxim 48
                  ore.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#FFD700] text-sm font-bold text-[#001f3f]">
                ✓
              </div>
              <div>
                <h4 className="font-semibold text-[#001f3f]">Feedback Regulat</h4>
                <p className="text-sm text-gray-600">
                  Oferă studenților feedback constructiv despre performanța lor pentru a-i ajuta să
                  crească.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-lg bg-gradient-to-r from-[#001f3f] to-[#003566] p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-white">Începe Să Creezi</h2>
          <p className="mb-6 text-white/90">
            Creează prima ta activitate de voluntariat și conectează-te cu studenții motivați!
          </p>
          <a
            href="/dashboard"
            className="inline-block rounded-lg bg-[#FFD700] px-8 py-3 font-semibold text-[#001f3f] transition-transform hover:scale-105"
          >
            Accesează Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
