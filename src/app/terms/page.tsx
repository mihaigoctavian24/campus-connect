'use client';

import { FileText, Scale, AlertTriangle, CheckCircle, XCircle, Users } from 'lucide-react';

export default function TermsPage() {
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
            Termeni și Condiții
          </h1>
          <p className="text-lg text-white/90 sm:text-xl">
            Regulile de utilizare a platformei CampusConnect
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8">
        {/* Introduction */}
        <section className="mb-12">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <FileText className="h-8 w-8 text-[#800020]" />
              <h2 className="text-2xl font-bold text-[#001f3f]">Introducere</h2>
            </div>
            <p className="mb-4 text-gray-700">
              Bine ai venit pe CampusConnect! Acești Termeni și Condiții ("Termeni") stabilesc
              regulile pentru utilizarea platformei noastre de gestionare a activităților de
              voluntariat universitar.
            </p>
            <p className="mb-4 text-gray-700">
              Prin crearea unui cont sau utilizarea serviciilor noastre, confirmi că ai citit,
              înțeles și accepți să fii legat de acești Termeni, precum și de{' '}
              <a href="/privacy" className="text-[#800020] underline hover:text-[#a00828]">
                Politica de Confidențialitate
              </a>
              .
            </p>
            <p className="text-sm text-gray-500">
              <strong>Ultima actualizare:</strong> Decembrie 2025
            </p>
          </div>
        </section>

        {/* Acceptance */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">1. Acceptarea Termenilor</h2>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-600" />
                <div>
                  <h4 className="mb-2 font-semibold text-[#001f3f]">
                    Capacitate de a Contracta
                  </h4>
                  <p className="text-sm text-gray-600">
                    Trebuie să fii student, profesor sau angajat al Romanian-American University
                    pentru a utiliza platforma. Dacă ești sub 18 ani, un părinte sau tutore legal
                    trebuie să accepte acești Termeni în numele tău.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-600" />
                <div>
                  <h4 className="mb-2 font-semibold text-[#001f3f]">Înțelegere Completă</h4>
                  <p className="text-sm text-gray-600">
                    Acești Termeni, împreună cu Politica de Confidențialitate și Politica de
                    Cookie-uri, constituie întreaga înțelegere între tine și CampusConnect.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 flex-shrink-0 text-yellow-600" />
                <div>
                  <h4 className="mb-2 font-semibold text-[#001f3f]">Dezacord</h4>
                  <p className="text-sm text-gray-600">
                    Dacă nu ești de acord cu acești Termeni, te rugăm să nu folosești platforma.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* User Accounts */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">2. Conturi de Utilizator</h2>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-[#001f3f]">
                Crearea și Securitatea Contului
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#800020]">•</span>
                  <span>
                    Trebuie să furnizezi informații corecte, complete și actualizate la înregistrare
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#800020]">•</span>
                  <span>
                    Ești responsabil pentru menținerea confidențialității parolei și contului tău
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#800020]">•</span>
                  <span>
                    Trebuie să ne notifici imediat despre orice utilizare neautorizată a contului
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#800020]">•</span>
                  <span>Nu poți transfera sau partaja contul cu altă persoană</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#800020]">•</span>
                  <span>Este interzisă crearea de conturi multiple pentru aceeași persoană</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-[#001f3f]">Roluri și Permisiuni</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="mb-2 flex items-center gap-2 font-semibold text-[#001f3f]">
                    <Users className="h-4 w-4 text-[#800020]" />
                    Studenți
                  </h4>
                  <p className="text-sm text-gray-600">
                    Pot naviga activități, aplica, înregistra prezența și genera certificate pentru
                    orele acumulate.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 flex items-center gap-2 font-semibold text-[#001f3f]">
                    <Users className="h-4 w-4 text-[#800020]" />
                    Profesori
                  </h4>
                  <p className="text-sm text-gray-600">
                    Pot crea activități, gestiona aplicări, valida ore de voluntariat și genera
                    rapoarte.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 flex items-center gap-2 font-semibold text-[#001f3f]">
                    <Users className="h-4 w-4 text-[#800020]" />
                    Administratori
                  </h4>
                  <p className="text-sm text-gray-600">
                    Au acces complet pentru gestionarea utilizatorilor, configurări sistem și
                    rapoarte avansate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Acceptable Use */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">3. Utilizare Acceptabilă</h2>

          <div className="space-y-6">
            <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-900">Activități Permise</h3>
              </div>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Participarea la activități de voluntariat legitime</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Comunicarea respectuoasă cu organizatorii și ceilalți voluntari</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Oferirea de feedback constructiv</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Raportarea problemelor tehnice sau a abuzurilor</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <XCircle className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-red-900">Activități Interzise</h3>
              </div>
              <ul className="space-y-2 text-sm text-red-800">
                <li className="flex items-start gap-2">
                  <span>✗</span>
                  <span>
                    <strong>Fraudă:</strong> Falsificarea prezenței, ore de voluntariat sau alte
                    date
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✗</span>
                  <span>
                    <strong>Hărțuire:</strong> Comportament abuziv, discriminatoriu sau amenințător
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✗</span>
                  <span>
                    <strong>Spam:</strong> Trimiterea de mesaje nesolicitate sau publicitate
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✗</span>
                  <span>
                    <strong>Hacking:</strong> Încercări de acces neautorizat sau exploatare a
                    vulnerabilităților
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✗</span>
                  <span>
                    <strong>Conținut ilegal:</strong> Încărcarea sau distribuirea de material
                    interzis legal
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✗</span>
                  <span>
                    <strong>Scraping:</strong> Extragerea automată de date fără permisiune
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✗</span>
                  <span>
                    <strong>Impersonare:</strong> Pretinderea că ești altcineva
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Volunteer Activities */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">
            4. Activități de Voluntariat
          </h2>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-[#001f3f]">
                Aplicare și Participare
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#800020]">•</span>
                  <span>
                    Aplicarea la o activitate nu garantează automat acceptarea (depinde de
                    criterii)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#800020]">•</span>
                  <span>
                    Dacă ești acceptat, te angajezi să participi conform programului anunțat
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#800020]">•</span>
                  <span>
                    Anulări repetate sau neprezentat pot duce la restricții de participare
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#800020]">•</span>
                  <span>
                    Orele de voluntariat sunt validate de profesor prin QR code sau manual
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-[#001f3f]">
                Certificate și Evidențe
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#800020]">•</span>
                  <span>Certificatele sunt generate doar pentru ore validate de profesori</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#800020]">•</span>
                  <span>
                    Fraudarea orelor de voluntariat poate duce la anularea tuturor certificatelor
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#800020]">•</span>
                  <span>
                    Evidențele sunt păstrate pentru audit și conformitate academică (5 ani)
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-[#001f3f]">
                Responsabilitatea Profesorilor
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#800020]">•</span>
                  <span>
                    Profesorii trebuie să ofere descrieri corecte și complete ale activităților
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#800020]">•</span>
                  <span>Sunt responsabili pentru validarea corectă a orelor de voluntariat</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#800020]">•</span>
                  <span>
                    Trebuie să comunice în timp util modificări de program sau anulări
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">
            5. Proprietate Intelectuală
          </h2>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold text-[#001f3f]">
                  Conținutul CampusConnect
                </h4>
                <p className="text-sm text-gray-600">
                  Toată proprietatea intelectuală a platformei (cod, design, logo, text,
                  funcționalități) aparține Romanian-American University și este protejată de
                  legile drepturilor de autor.
                </p>
              </div>

              <div>
                <h4 className="mb-2 font-semibold text-[#001f3f]">Conținutul Tău</h4>
                <p className="mb-3 text-sm text-gray-600">
                  Când încarci conținut (poze, descrieri, feedback), păstrezi drepturile de autor
                  dar ne acorzi o licență pentru a:
                </p>
                <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                  <li>Afișa conținutul în platformă</li>
                  <li>Stoca și procesa pentru funcționare</li>
                  <li>Utiliza în materiale promoționale (cu consimțământ)</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2 font-semibold text-[#001f3f]">Restricții</h4>
                <p className="text-sm text-gray-600">
                  Nu poți copia, modifica, distribui sau crea lucrări derivate din platforma noastră
                  fără permisiune scrisă.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">
            6. Limitarea Răspunderii
          </h2>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 rounded-lg bg-yellow-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <h4 className="font-semibold text-yellow-900">
                  Utilizare "Așa Cum Este"
                </h4>
              </div>
              <p className="text-sm text-yellow-800">
                Platforma este furnizată "așa cum este" fără garanții de niciun fel. Nu garantăm
                că serviciile vor fi neîntrerupte, lipsite de erori sau complet sigure.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                <strong>Nu suntem responsabili pentru:</strong>
              </p>
              <ul className="list-inside list-disc space-y-2 text-sm text-gray-600">
                <li>Pierderi de date cauzate de probleme tehnice</li>
                <li>Daune indirecte sau consecințe negative din utilizare</li>
                <li>
                  Conținut generat de utilizatori (responsabilitatea aparține autorilor)
                </li>
                <li>Dispute între studenți și organizatori de activități</li>
                <li>Probleme cauzate de incompatibilități de browser sau dispozitiv</li>
              </ul>

              <p className="mt-4 text-sm text-gray-700">
                <strong>Limitare maximă:</strong> În orice caz, răspunderea noastră totală nu va
                depăși suma de 0 RON (zero lei), platforma fiind gratuită pentru utilizatori.
              </p>
            </div>
          </div>
        </section>

        {/* Termination */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">7. Suspendare și Încetare</h2>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-[#001f3f]">
                Suspendarea Contului
              </h3>
              <p className="mb-3 text-sm text-gray-700">
                Ne rezervăm dreptul de a suspenda sau închide contul tău dacă:
              </p>
              <ul className="list-inside list-disc space-y-2 text-sm text-gray-600">
                <li>Încalci acești Termeni și Condiții</li>
                <li>Fraudezi sistemul (ore false, prezență falsă)</li>
                <li>Ai comportament abuziv sau hărțuitor</li>
                <li>Încalci legile aplicabile</li>
                <li>Contul rămâne inactiv mai mult de 2 ani academici</li>
              </ul>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-[#001f3f]">Ștergere Voluntară</h3>
              <p className="mb-3 text-sm text-gray-700">
                Poți solicita ștergerea contului oricând prin secțiunea de setări sau contactându-ne.
                Reține că:
              </p>
              <ul className="list-inside list-disc space-y-2 text-sm text-gray-600">
                <li>
                  Datele personale vor fi șterse conform politicii de confidențialitate (30 zile)
                </li>
                <li>
                  Evidențele de voluntariat validate pot fi păstrate pentru audit (obligație legală)
                </li>
                <li>Certificatele emise vor rămâne valide</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Modifications */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">8. Modificări ale Termenilor</h2>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="mb-4 text-gray-700">
              Ne rezervăm dreptul de a modifica acești Termeni oricând. Modificările vor intra în
              vigoare după:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-2 text-sm text-gray-600">
              <li>Publicarea pe platformă cu data actualizării</li>
              <li>Notificare prin email (pentru modificări majore)</li>
              <li>Notificare în aplicație la următorul login</li>
            </ul>
            <p className="text-sm text-gray-700">
              Utilizarea continuă a platformei după modificări înseamnă acceptarea noilor Termeni.
              Dacă nu ești de acord, poți să îți închizi contul.
            </p>
          </div>
        </section>

        {/* Governing Law */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">
            9. Legea Aplicabilă și Jurisdicție
          </h2>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <Scale className="h-6 w-6 text-[#800020]" />
              <h3 className="text-lg font-semibold text-[#001f3f]">
                Legislație și Rezolvare Dispute
              </h3>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>Legea aplicabilă:</strong> Acești Termeni sunt guvernați de legile
                României.
              </p>
              <p>
                <strong>Jurisdicție:</strong> Orice dispută va fi soluționată de instanțele
                competente din București, România.
              </p>
              <p>
                <strong>Rezolvare alternativă:</strong> Înainte de acțiune în instanță, încurajăm
                rezolvarea amiabilă prin contact direct cu echipa CampusConnect.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section>
          <div className="rounded-lg bg-gradient-to-r from-[#001f3f] to-[#003566] p-8 text-center text-white">
            <h2 className="mb-3 text-2xl font-bold">Întrebări despre Termeni?</h2>
            <p className="mb-6 text-white/90">
              Dacă ai nelămuriri despre acești Termeni și Condiții, contactează-ne:
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:legal@campusconnect-scs.work"
                  className="text-[#FFD700] underline"
                >
                  legal@campusconnect-scs.work
                </a>
              </p>
              <p>
                <strong>Contact:</strong>{' '}
                <a href="/contact" className="text-[#FFD700] underline">
                  campusconnect-scs.work/contact
                </a>
              </p>
            </div>
            <div className="mt-6">
              <a
                href="/privacy"
                className="inline-block rounded-lg bg-[#FFD700] px-8 py-3 font-semibold text-[#001f3f] transition-transform hover:scale-105"
              >
                Citește Politica de Confidențialitate
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
