'use client';

import {
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Heart,
  QrCode,
  Star,
  UserCheck,
} from 'lucide-react';

export default function StudentGuidePage() {
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
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Ghid pentru Studenți</h1>
          <p className="text-lg text-white/90 sm:text-xl">
            Tot ce trebuie să știi pentru a începe aventura de voluntariat
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-8">
        {/* Getting Started */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">Primii Pași</h2>
          <div className="space-y-6">
            <div className="rounded-lg border-l-4 border-[#FFD700] bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <UserCheck className="h-6 w-6 flex-shrink-0 text-[#001f3f]" />
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-[#001f3f]">
                    1. Creează-ți Contul
                  </h3>
                  <p className="text-gray-700">
                    Înregistrează-te cu email-ul universitar (@stud.rau.ro). Completează profilul cu
                    informații despre facultate, an de studiu și interese. Verifică email-ul pentru
                    activarea contului.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border-l-4 border-[#FFD700] bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <BookOpen className="h-6 w-6 flex-shrink-0 text-[#001f3f]" />
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-[#001f3f]">
                    2. Explorează Oportunități
                  </h3>
                  <p className="text-gray-700">
                    Navighează prin activitățile disponibile folosind filtrele: categorie (Mediu,
                    Educație, Social), locație, număr de ore necesar. Salvează cele care te
                    interesează pentru mai târziu.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border-l-4 border-[#FFD700] bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <FileText className="h-6 w-6 flex-shrink-0 text-[#001f3f]" />
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-[#001f3f]">
                    3. Aplică la Activități
                  </h3>
                  <p className="text-gray-700">
                    Citește cu atenție descrierea activității și cerințele. Completează formularul
                    de aplicare cu motivația ta. Așteaptă confirmarea de la profesor (primeș ti
                    notificare).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* During Activities */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">Pe Parcursul Activității</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <QrCode className="mb-4 h-8 w-8 text-[#800020]" />
              <h3 className="mb-3 text-lg font-semibold text-[#001f3f]">Scanare QR Code</h3>
              <p className="mb-4 text-gray-700">
                La fiecare sesiune, profesorul afișează un QR code unic. Scanează-l cu telefonul
                pentru a-ți marca prezența automat.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>Deschide camera telefonului</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>Direcționează spre QR code</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>Click pe link-ul afișat</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <Clock className="mb-4 h-8 w-8 text-[#800020]" />
              <h3 className="mb-3 text-lg font-semibold text-[#001f3f]">Acumulare Ore</h3>
              <p className="mb-4 text-gray-700">
                Orele de voluntariat sunt calculate automat în funcție de durata sesiunilor la care
                ai participat.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Star className="h-4 w-4 flex-shrink-0 text-[#FFD700]" />
                  <span>Verifică progresul în dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-4 w-4 flex-shrink-0 text-[#FFD700]" />
                  <span>Vezi ore validate vs. ore rămase</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-4 w-4 flex-shrink-0 text-[#FFD700]" />
                  <span>Primești notificări la milestone-uri</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tips & Best Practices */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">Sfaturi Utile</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-gradient-to-br from-[#001f3f] to-[#003566] p-6 text-white">
              <Heart className="mb-3 h-8 w-8" />
              <h3 className="mb-2 text-lg font-semibold">Fii Consecvent</h3>
              <p className="text-sm text-white/90">
                Prezența regulată la sesiuni demonstrează angajament și îți crește șansele pentru
                recomandări.
              </p>
            </div>

            <div className="rounded-lg bg-gradient-to-br from-[#800020] to-[#a00828] p-6 text-white">
              <CheckCircle className="mb-3 h-8 w-8" />
              <h3 className="mb-2 text-lg font-semibold">Comunică Activ</h3>
              <p className="text-sm text-white/90">
                Dacă ai întrebări sau probleme, contactează profesorul coordonator prin platforma.
              </p>
            </div>

            <div className="rounded-lg bg-gradient-to-br from-[#4a5568] to-[#2d3748] p-6 text-white">
              <FileText className="mb-3 h-8 w-8" />
              <h3 className="mb-2 text-lg font-semibold">Feedback Constructiv</h3>
              <p className="text-sm text-white/90">
                La final, oferă feedback sincer pentru îmbunătățirea activităților viitoare.
              </p>
            </div>
          </div>
        </section>

        {/* Dashboard Features */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">
            Funcționalități Dashboard Personal
          </h2>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#001f3f] text-white text-sm font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-[#001f3f]">Activități Active</h4>
                  <p className="text-sm text-gray-600">
                    Vezi toate activitățile la care ești înscris și sesiunile viitoare.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#001f3f] text-white text-sm font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-[#001f3f]">Salvate</h4>
                  <p className="text-sm text-gray-600">
                    Păstrează oportunități interesante pentru mai târziu.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#001f3f] text-white text-sm font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-[#001f3f]">Istoric & Certificate</h4>
                  <p className="text-sm text-gray-600">
                    Accesează toate activitățile finalizate și descarcă certificatele.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#001f3f] text-white text-sm font-semibold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-[#001f3f]">Statistici Personale</h4>
                  <p className="text-sm text-gray-600">
                    Total ore acumulate, activități finalizate, categorii preferate.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-lg bg-gradient-to-r from-[#001f3f] to-[#003566] p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-white">Gata să Începi?</h2>
          <p className="mb-6 text-white/90">
            Explorează oportunitățile disponibile și începe să faci diferența!
          </p>
          <a
            href="/explore"
            className="inline-block rounded-lg bg-[#FFD700] px-8 py-3 font-semibold text-[#001f3f] transition-transform hover:scale-105"
          >
            Explorează Oportunități
          </a>
        </div>
      </div>
    </div>
  );
}
