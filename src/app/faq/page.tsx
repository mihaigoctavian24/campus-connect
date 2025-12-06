'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
  category: 'student' | 'professor' | 'general';
}

const faqs: FAQ[] = [
  // General
  {
    question: 'Ce este CampusConnect?',
    answer:
      'CampusConnect este o platformă digitală dedicată gestionării activităților de voluntariat universitar. Facilitează conectarea studenților cu oportunități de voluntariat organizate de profesori și instituții partenere.',
    category: 'general',
  },
  {
    question: 'Este platforma gratuită?',
    answer:
      'Da, CampusConnect este complet gratuit pentru toți studenții și profesorii din cadrul Universității Romano-Americane.',
    category: 'general',
  },
  {
    question: 'Cum mă pot înregistra?',
    answer:
      'Accesează pagina de înregistrare și folosește email-ul tău universitar (@stud.rau.ro pentru studenți sau @rau.ro pentru profesori). Vei primi un email de confirmare pentru a-ți activa contul.',
    category: 'general',
  },

  // Students
  {
    question: 'Cum găsesc activități de voluntariat?',
    answer:
      'Accesează secțiunea "Explorează Oportunități" și folosește filtrele pentru a găsi activități potrivite intereselor tale: categorie, locație, număr de ore și perioadă.',
    category: 'student',
  },
  {
    question: 'Cum mă înscriu la o activitate?',
    answer:
      'Click pe activitatea dorită, citește detaliile și apasă butonul "Aplică". Completează formularul cu motivația ta și așteaptă confirmarea de la profesor.',
    category: 'student',
  },
  {
    question: 'Cum îmi înregistrez prezența la sesiuni?',
    answer:
      'La fiecare sesiune, profesorul va afișa un QR code pe care îl vei scana cu telefonul pentru a-ți marca prezența automat. Alternativ, profesorul poate valida manual participarea.',
    category: 'student',
  },
  {
    question: 'Cum primesc certificatul de voluntariat?',
    answer:
      'După finalizarea activității și validarea tuturor orelor, vei putea descărca certificatul oficial din dashboard-ul tău personal, secțiunea "Certificatele Mele".',
    category: 'student',
  },
  {
    question: 'Pot vedea istoricul meu de voluntariat?',
    answer:
      'Da, în dashboard-ul personal poți accesa toate activitățile la care ai participat, orele acumulate și certificatele obținute.',
    category: 'student',
  },
  {
    question: 'Ce se întâmplă dacă lipsesc de la o sesiune?',
    answer:
      'Absențele nejustificate sunt înregistrate automat. Dacă ai motive întemeiate, contactează profesorul coordonator pentru a discuta situația ta.',
    category: 'student',
  },

  // Professors
  {
    question: 'Cum creez o activitate nouă?',
    answer:
      'Din dashboard-ul de profesor, accesează "Activități" și apasă "Creează Activitate Nouă". Completează toate detaliile: titlu, descriere, categorie, număr de ore, locație și perioada de desfășurare.',
    category: 'professor',
  },
  {
    question: 'Cum gestionez aplicațiile studenților?',
    answer:
      'Primești notificări pentru fiecare aplicare nouă. Din secțiunea "Aplicații" poți vizualiza formularul completat de student și poți aproba sau respinge aplicația.',
    category: 'professor',
  },
  {
    question: 'Cum creez sesiuni pentru activitate?',
    answer:
      'După crearea activității, adaugă sesiuni specificând data, ora de începere și sfârșit, locația. Sistemul generează automat un QR code unic pentru fiecare sesiune.',
    category: 'professor',
  },
  {
    question: 'Cum validez prezența studenților?',
    answer:
      'Există două metode: (1) Afișează QR code-ul sesiunii și studenții îl scanează cu telefonul, sau (2) Marchează manual prezența din lista participanților înscriși.',
    category: 'professor',
  },
  {
    question: 'Pot exporta rapoarte despre activitate?',
    answer:
      'Da, poți genera și descărca rapoarte complete cu lista participanților, orele validate, prezențele și statistici detaliate în format PDF sau Excel.',
    category: 'professor',
  },
  {
    question: 'Cum modific sau anulез o sesiune?',
    answer:
      'Din secțiunea "Sesiuni", poți edita detaliile sau anula o sesiune. Studenții înscriși vor primi automat notificări despre modificări.',
    category: 'professor',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'student' | 'professor' | 'general'>(
    'all'
  );

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFAQs =
    activeCategory === 'all' ? faqs : faqs.filter((faq) => faq.category === activeCategory);

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
            Întrebări Frecvente (FAQ)
          </h1>
          <p className="text-lg text-white/90 sm:text-xl">
            Răspunsuri la cele mai comune întrebări despre CampusConnect
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8">
        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setActiveCategory('all')}
            className={`rounded-full px-6 py-2 font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-[#001f3f] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Toate
          </button>
          <button
            onClick={() => setActiveCategory('general')}
            className={`rounded-full px-6 py-2 font-medium transition-colors ${
              activeCategory === 'general'
                ? 'bg-[#001f3f] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveCategory('student')}
            className={`rounded-full px-6 py-2 font-medium transition-colors ${
              activeCategory === 'student'
                ? 'bg-[#001f3f] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Studenți
          </button>
          <button
            onClick={() => setActiveCategory('professor')}
            className={`rounded-full px-6 py-2 font-medium transition-colors ${
              activeCategory === 'professor'
                ? 'bg-[#001f3f] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Profesori
          </button>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-50"
              >
                <span className="pr-4 text-lg font-semibold text-[#001f3f]">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-[#001f3f] transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="border-t border-gray-200 bg-gray-50 p-6">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 rounded-lg bg-gradient-to-r from-[#001f3f] to-[#003566] p-8 text-center">
          <h2 className="mb-3 text-2xl font-bold text-white">Nu ai găsit răspunsul?</h2>
          <p className="mb-6 text-white/90">Contactează-ne și te vom ajuta cu plăcere!</p>
          <a
            href="/contact"
            className="inline-block rounded-lg bg-[#FFD700] px-8 py-3 font-semibold text-[#001f3f] transition-transform hover:scale-105"
          >
            Trimite Mesaj
          </a>
        </div>
      </div>
    </div>
  );
}
