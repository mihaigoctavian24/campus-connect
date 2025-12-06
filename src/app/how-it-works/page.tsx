'use client';

export default function HowItWorksPage() {
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
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Cum Funcționează?</h1>
          <p className="text-lg text-white/90 sm:text-xl">
            Ghid complet pentru a începe aventura ta de voluntariat
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        {/* For Students */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-bold text-[#001f3f] sm:text-3xl">Pentru Studenți</h2>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#001f3f] text-xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[#001f3f]">Creează Cont</h3>
              <p className="text-gray-600">
                Înregistrează-te folosind email-ul universitar și completează-ți profilul cu
                informațiile necesare.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#001f3f] text-xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[#001f3f]">Explorează Oportunități</h3>
              <p className="text-gray-600">
                Navighează prin activitățile disponibile, filtrează după categorie, locație și
                domeniu de interes.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#001f3f] text-xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[#001f3f]">Aplică</h3>
              <p className="text-gray-600">
                Completează formularul de aplicare pentru activitățile care te interesează și
                așteaptă confirmarea.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#800020] text-xl font-bold text-white">
                4
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[#800020]">Participă</h3>
              <p className="text-gray-600">
                Prezintă-te la sesiunile programate și scanează QR code-ul pentru a-ți înregistra
                prezența.
              </p>
            </div>

            {/* Step 5 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#800020] text-xl font-bold text-white">
                5
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[#800020]">Acumulează Ore</h3>
              <p className="text-gray-600">
                Orele tale de voluntariat sunt validate automat și poți urmări progresul în
                dashboard-ul personal.
              </p>
            </div>

            {/* Step 6 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#800020] text-xl font-bold text-white">
                6
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[#800020]">Primește Certificat</h3>
              <p className="text-gray-600">
                La finalizarea activității, descarcă certificatul oficial care atestă orele de
                voluntariat efectuate.
              </p>
            </div>
          </div>
        </section>

        {/* For Professors */}
        <section>
          <h2 className="mb-8 text-2xl font-bold text-[#001f3f] sm:text-3xl">Pentru Profesori</h2>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#001f3f] text-xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[#001f3f]">Creează Activitate</h3>
              <p className="text-gray-600">
                Definește activitatea: titlu, descriere, număr de ore, locație și perioadă de
                desfășurare.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#001f3f] text-xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[#001f3f]">Gestionează Aplicații</h3>
              <p className="text-gray-600">
                Primești notificări pentru fiecare aplicare și poți aproba sau respinge studenții.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#001f3f] text-xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[#001f3f]">Planifică Sesiuni</h3>
              <p className="text-gray-600">
                Adaugă sesiuni cu date, ore și locații specifice. Sistemul generează automat QR
                code-uri.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#800020] text-xl font-bold text-white">
                4
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[#800020]">Validează Prezența</h3>
              <p className="text-gray-600">
                Studenții scanează QR code-ul la sesiuni sau poți valida manual prezența
                participanților.
              </p>
            </div>

            {/* Step 5 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#800020] text-xl font-bold text-white">
                5
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[#800020]">Monitorizează Progres</h3>
              <p className="text-gray-600">
                Vezi statistici detaliate despre participare, ore acumulate și feedback-ul
                studenților.
              </p>
            </div>

            {/* Step 6 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#800020] text-xl font-bold text-white">
                6
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[#800020]">Generează Rapoarte</h3>
              <p className="text-gray-600">
                Exportă rapoarte complete cu toți participanții și orele validate pentru evidențele
                instituției.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 rounded-lg bg-gradient-to-r from-[#001f3f] to-[#003566] p-8 text-center sm:p-12">
          <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">Gata să Începi?</h2>
          <p className="mb-6 text-lg text-white/90">
            Alătură-te comunității CampusConnect și fă diferența prin voluntariat
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/explore"
              className="inline-block rounded-lg bg-[#FFD700] px-8 py-3 font-semibold text-[#001f3f] transition-transform hover:scale-105"
            >
              Explorează Oportunități
            </a>
            <a
              href="/auth/register"
              className="inline-block rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-all hover:bg-white hover:text-[#001f3f]"
            >
              Creează Cont
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
