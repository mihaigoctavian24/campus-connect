'use client';

import { Shield, Lock, Eye, Database, UserCheck, Mail } from 'lucide-react';

export default function PrivacyPage() {
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
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Politica de Confidențialitate
          </h1>
          <p className="text-lg text-white/90 sm:text-xl">
            Cum protejăm și gestionăm datele tale personale
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8">
        {/* Introduction */}
        <section className="mb-12">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <Shield className="h-8 w-8 text-[#800020]" />
              <h2 className="text-2xl font-bold text-[#001f3f]">Introducere</h2>
            </div>
            <p className="mb-4 text-gray-700">
              CampusConnect ("noi", "noastră" sau "platforma") respectă confidențialitatea
              utilizatorilor săi și se angajează să protejeze datele personale pe care le colectăm
              și le procesăm. Această politică explică ce date colectăm, cum le folosim și care
              sunt drepturile tale conform GDPR (Regulamentul General privind Protecția Datelor).
            </p>
            <p className="text-sm text-gray-500">
              <strong>Ultima actualizare:</strong> Decembrie 2025
            </p>
          </div>
        </section>

        {/* Data Collection */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">
            Ce Date Personale Colectăm
          </h2>

          <div className="space-y-6">
            {/* Account Data */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <UserCheck className="h-6 w-6 text-[#800020]" />
                <h3 className="text-xl font-semibold text-[#001f3f]">Date de Cont</h3>
              </div>
              <p className="mb-3 text-gray-700">Când îți creezi un cont, colectăm:</p>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                <li>Nume și prenume</li>
                <li>Adresă de email (universitară sau personală)</li>
                <li>Parolă (criptată, nu o stocăm în format text)</li>
                <li>Rol (student, profesor, administrator)</li>
                <li>Facultate și an de studiu (pentru studenți)</li>
                <li>Departament (pentru profesori)</li>
              </ul>
            </div>

            {/* Activity Data */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Database className="h-6 w-6 text-[#800020]" />
                <h3 className="text-xl font-semibold text-[#001f3f]">Date de Activitate</h3>
              </div>
              <p className="mb-3 text-gray-700">
                Pe măsură ce folosești platforma, înregistrăm:
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                <li>Aplicări la activități de voluntariat</li>
                <li>Prezență la sesiuni (prin QR code sau validare manuală)</li>
                <li>Ore de voluntariat acumulate</li>
                <li>Certificate generate</li>
                <li>Feedback și evaluări</li>
                <li>Comunicări cu organizatorii</li>
              </ul>
            </div>

            {/* Technical Data */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Eye className="h-6 w-6 text-[#800020]" />
                <h3 className="text-xl font-semibold text-[#001f3f]">Date Tehnice</h3>
              </div>
              <p className="mb-3 text-gray-700">Automat, colectăm:</p>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                <li>Adresă IP și locație aproximativă</li>
                <li>Tip de browser și dispozitiv</li>
                <li>Pagini vizitate și timp petrecut</li>
                <li>Cookie-uri (conform politicii de cookie-uri)</li>
                <li>Log-uri de erori pentru debugging</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How We Use Data */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">Cum Folosim Datele Tale</h2>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="mb-4 text-gray-700">
              Procesăm datele tale personale doar pentru scopuri legitime și legale:
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold text-[#001f3f]">
                  1. Furnizarea Serviciilor (Bază legală: Contract)
                </h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                  <li>Gestionarea contului și autentificarea</li>
                  <li>Înregistrarea la activități de voluntariat</li>
                  <li>Urmărirea orelor de voluntariat</li>
                  <li>Generarea certificatelor</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2 font-semibold text-[#001f3f]">
                  2. Comunicare (Bază legală: Interes legitim)
                </h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                  <li>Notificări despre activități și sesiuni</li>
                  <li>Confirmări de aplicare și validări de ore</li>
                  <li>Anunțuri importante despre platformă</li>
                  <li>Suport tehnic și răspunsuri la întrebări</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2 font-semibold text-[#001f3f]">
                  3. Îmbunătățirea Platformei (Bază legală: Consimțământ)
                </h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                  <li>Analiză de utilizare pentru optimizare</li>
                  <li>Identificarea și rezolvarea erorilor</li>
                  <li>Dezvoltarea de funcționalități noi</li>
                  <li>Personalizarea experienței</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2 font-semibold text-[#001f3f]">
                  4. Conformitate Legală (Bază legală: Obligație legală)
                </h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                  <li>Păstrarea evidențelor pentru audit universitar</li>
                  <li>Respectarea cerințelor legale de raportare</li>
                  <li>Prevenirea fraudei și abuzurilor</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Data Sharing */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">
            Cu Cine Partajăm Datele
          </h2>

          <div className="space-y-4">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-[#001f3f]">
                În cadrul Universității
              </h3>
              <p className="text-sm text-gray-600">
                Datele tale pot fi accesate de către profesorii coordonatori ai activităților la
                care ești înscris și de către administratorii sistemului (departamentul de
                voluntariat al universității).
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-[#001f3f]">Furnizori Terți</h3>
              <p className="mb-3 text-sm text-gray-600">
                Folosim furnizori de servicii pentru anumite funcționalități:
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                <li>
                  <strong>Supabase:</strong> Hosting bază de date și autentificare (UE/SUA, GDPR
                  compliant)
                </li>
                <li>
                  <strong>Vercel:</strong> Hosting platformă (cloud global, GDPR compliant)
                </li>
                <li>
                  <strong>Google Analytics:</strong> Analiză de trafic (doar cu consimțământ)
                </li>
                <li>
                  <strong>Sentry:</strong> Monitorizare erori (date anonimizate)
                </li>
              </ul>
              <p className="mt-3 text-xs text-gray-500">
                Toți furnizorii respectă GDPR și au acorduri de procesare a datelor.
              </p>
            </div>

            <div className="rounded-lg border-2 border-[#800020] bg-[#800020]/5 p-6">
              <div className="mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5 text-[#800020]" />
                <h3 className="text-lg font-semibold text-[#001f3f]">NU Vindem Date</h3>
              </div>
              <p className="text-sm text-gray-700">
                <strong>Niciodată</strong> nu vindem, închiriem sau transferăm datele tale personale
                către terțe părți în scopuri comerciale.
              </p>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">Drepturile Tale GDPR</h2>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="mb-4 text-gray-700">
              Conform GDPR, ai următoarele drepturi privind datele tale:
            </p>
            <div className="space-y-3">
              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="mb-2 font-semibold text-[#001f3f]">
                  🔍 Dreptul de Acces
                </h4>
                <p className="text-sm text-gray-600">
                  Poți solicita o copie a tuturor datelor personale pe care le deținem despre tine.
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="mb-2 font-semibold text-[#001f3f]">
                  ✏️ Dreptul de Rectificare
                </h4>
                <p className="text-sm text-gray-600">
                  Poți cere corectarea datelor incorecte sau completarea celor incomplete.
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="mb-2 font-semibold text-[#001f3f]">🗑️ Dreptul la Ștergere</h4>
                <p className="text-sm text-gray-600">
                  Poți solicita ștergerea datelor în anumite condiții (excepție: evidențe legale
                  necesare).
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="mb-2 font-semibold text-[#001f3f]">
                  ⛔ Dreptul de Restricționare
                </h4>
                <p className="text-sm text-gray-600">
                  Poți limita modul în care folosim datele în anumite situații.
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="mb-2 font-semibold text-[#001f3f]">📦 Dreptul la Portabilitate</h4>
                <p className="text-sm text-gray-600">
                  Poți primi datele într-un format structurat pentru transfer la alt serviciu.
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="mb-2 font-semibold text-[#001f3f]">🚫 Dreptul de Opoziție</h4>
                <p className="text-sm text-gray-600">
                  Poți obiecta la anumite procesări bazate pe interes legitim (ex: marketing).
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-[#001f3f]/5 p-4">
              <p className="text-sm text-gray-700">
                <strong>Cum exerciți aceste drepturi:</strong> Contactează-ne la{' '}
                <a href="mailto:privacy@campusconnect-scs.work" className="text-[#800020] underline">
                  privacy@campusconnect-scs.work
                </a>{' '}
                sau prin secțiunea de contact. Răspundem în maxim 30 de zile.
              </p>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">Securitatea Datelor</h2>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <Lock className="h-6 w-6 text-[#800020]" />
              <h3 className="text-xl font-semibold text-[#001f3f]">
                Măsuri de Protecție
              </h3>
            </div>
            <p className="mb-4 text-gray-700">
              Luăm securitatea în serios și implementăm măsuri tehnice și organizatorice pentru
              protecția datelor:
            </p>
            <ul className="list-inside list-disc space-y-2 text-sm text-gray-600">
              <li>
                <strong>Criptare:</strong> Toate parolele sunt criptate cu algoritmi moderni
                (bcrypt)
              </li>
              <li>
                <strong>HTTPS:</strong> Comunicarea între browser și server este criptată
              </li>
              <li>
                <strong>Acces Restricționat:</strong> Doar personalul autorizat are acces la date
              </li>
              <li>
                <strong>Backup-uri Regulate:</strong> Pentru prevenirea pierderii datelor
              </li>
              <li>
                <strong>Monitorizare 24/7:</strong> Detectăm și răspundem rapid la incidente
              </li>
              <li>
                <strong>Actualizări de Securitate:</strong> Sistem mereu actualizat
              </li>
            </ul>
            <p className="mt-4 text-xs text-gray-500">
              Deși aplicăm cele mai bune practici, nicio metodă de transmisie sau stocare nu este
              100% sigură. În caz de breșă de securitate, vom notifica utilizatorii afectați și
              autoritățile conform GDPR.
            </p>
          </div>
        </section>

        {/* Data Retention */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">
            Cât Timp Păstrăm Datele
          </h2>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold text-[#001f3f]">Date de Cont Active</h4>
                <p className="text-sm text-gray-600">
                  Păstrate atât timp cât contul este activ sau necesar pentru servicii.
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-[#001f3f]">Evidențe de Voluntariat</h4>
                <p className="text-sm text-gray-600">
                  Păstrate 5 ani după absolvire pentru certificate și audituri (obligație legală).
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-[#001f3f]">Conturi Șterse</h4>
                <p className="text-sm text-gray-600">
                  Date personale șterse în 30 de zile după cerere (excepție: evidențe necesare
                  legal).
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-[#001f3f]">Date Tehnice/Analytics</h4>
                <p className="text-sm text-gray-600">
                  Anonimizate și agregate după 26 luni (standard Google Analytics).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">
            Confidențialitatea Minorilor
          </h2>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="mb-4 text-gray-700">
              Platforma este destinată studenților universitari (18+ ani). Dacă descoperi că un
              minor sub 16 ani și-a creat cont fără consimțământul părinților, te rugăm să ne
              contactezi imediat pentru a șterge contul.
            </p>
            <p className="text-sm text-gray-600">
              Pentru studenți între 16-18 ani, este responsabilitatea universității să asigure
              consimțământul părinților dacă este necesar conform regulamentelor interne.
            </p>
          </div>
        </section>

        {/* Changes to Policy */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">
            Modificări ale Politicii
          </h2>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="mb-4 text-gray-700">
              Putem actualiza această politică periodic. Modificările semnificative vor fi
              comunicate prin:
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
              <li>Email către toți utilizatorii activi</li>
              <li>Notificare în platformă la următorul login</li>
              <li>Actualizarea datei "Ultima actualizare" din antet</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              Continuarea utilizării platformei după modificări înseamnă acceptarea noii politici.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section>
          <div className="rounded-lg bg-gradient-to-r from-[#001f3f] to-[#003566] p-8 text-white">
            <div className="mb-4 flex items-center gap-3">
              <Mail className="h-8 w-8 text-[#FFD700]" />
              <h2 className="text-2xl font-bold">Contact & Întrebări</h2>
            </div>
            <p className="mb-6 text-white/90">
              Pentru orice întrebări despre confidențialitate sau pentru exercitarea drepturilor
              GDPR:
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:privacy@campusconnect-scs.work"
                  className="text-[#FFD700] underline"
                >
                  privacy@campusconnect-scs.work
                </a>
              </p>
              <p>
                <strong>Formular Contact:</strong>{' '}
                <a href="/contact" className="text-[#FFD700] underline">
                  campusconnect-scs.work/contact
                </a>
              </p>
              <p>
                <strong>Responsabil Protecție Date:</strong> Departamentul IT, CampusConnect
              </p>
            </div>
            <div className="mt-6 rounded-lg bg-white/10 p-4">
              <p className="text-sm text-white/90">
                <strong>Drept de reclamație:</strong> Dacă consideri că datele tale nu sunt
                procesate conform GDPR, poți depune o plângere la{' '}
                <a
                  href="https://www.dataprotection.ro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFD700] underline"
                >
                  Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal
                  (ANSPDCP)
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
