'use client';

import { Book, FileQuestion, HelpCircle, Mail, MessageCircle, Video } from 'lucide-react';

export default function SupportPage() {
  const supportResources = [
    {
      title: 'Ghid pentru Studenți',
      description: 'Tot ce trebuie să știi pentru a începe aventura de voluntariat',
      icon: Book,
      link: '/guides/student',
      color: 'from-[#001f3f] to-[#003566]',
    },
    {
      title: 'Ghid pentru Profesori',
      description: 'Totul despre crearea și gestionarea activităților',
      icon: Book,
      link: '/guides/professor',
      color: 'from-[#800020] to-[#a00828]',
    },
    {
      title: 'Întrebări Frecvente',
      description: 'Răspunsuri la cele mai comune întrebări',
      icon: HelpCircle,
      link: '/faq',
      color: 'from-[#4a5568] to-[#2d3748]',
    },
  ];

  const commonIssues = [
    {
      category: 'Probleme de Cont',
      issues: [
        {
          q: 'Nu pot să mă loghez',
          a: 'Verifică dacă ai confirmat email-ul de activare. Folosește funcția "Resetare Parolă" dacă ai uitat parola.',
        },
        {
          q: 'Nu primesc email-uri de la platformă',
          a: 'Verifică folderul Spam/Junk. Adaugă contact@campusconnect-scs.work în lista de contacte sigure.',
        },
        {
          q: 'Vreau să îmi schimb email-ul',
          a: 'Contactează suportul prin formularul de contact cu noua adresă de email dorită.',
        },
      ],
    },
    {
      category: 'Probleme cu Activități',
      issues: [
        {
          q: 'Nu pot scana QR code-ul',
          a: 'Asigură-te că ai permisiuni pentru cameră. Încearcă să reîncarci pagina sau folosește alt browser.',
        },
        {
          q: 'Aplicația mea nu a fost aprobată',
          a: 'Profesorul coordonator poate respinge aplicații. Citește motivul în notificare și încearcă alte activități.',
        },
        {
          q: 'Orele nu apar în dashboard',
          a: 'Orele apar după validarea profesorului. Durează până în 24 ore după sesiune.',
        },
      ],
    },
    {
      category: 'Probleme Tehnice',
      issues: [
        {
          q: 'Platforma se încarcă lent',
          a: 'Șterge cache-ul browserului. Încearcă să accesezi platforma în modul incognito.',
        },
        {
          q: 'Eroare la încărcare fișiere',
          a: 'Verifică dimensiunea fișierului (max 5MB) și formatul acceptat (PDF, JPG, PNG).',
        },
        {
          q: 'Layout-ul arată ciudat pe mobil',
          a: 'Actualizează browserul la ultima versiune. Platforma funcționează optim pe Chrome, Safari, Firefox.',
        },
      ],
    },
  ];

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
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Centru de Suport</h1>
          <p className="text-lg text-white/90 sm:text-xl">
            Găsește răspunsuri rapide și obține ajutor pentru orice problemă
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        {/* Quick Resources */}
        <section className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-[#001f3f] sm:text-3xl">
            Resurse Utile
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {supportResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <a
                  key={index}
                  href={resource.link}
                  className="group rounded-lg bg-white p-6 shadow-sm transition-all hover:scale-105 hover:shadow-md"
                >
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${resource.color}`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[#001f3f] group-hover:text-[#800020]">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                </a>
              );
            })}
          </div>
        </section>

        {/* Common Issues */}
        <section className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-[#001f3f] sm:text-3xl">
            Probleme Frecvente
          </h2>
          <div className="space-y-8">
            {commonIssues.map((category, catIndex) => (
              <div key={catIndex}>
                <h3 className="mb-4 text-xl font-semibold text-[#800020]">{category.category}</h3>
                <div className="space-y-4">
                  {category.issues.map((issue, issueIndex) => (
                    <div key={issueIndex} className="rounded-lg bg-white p-5 shadow-sm">
                      <div className="mb-2 flex items-start gap-3">
                        <FileQuestion className="h-5 w-5 flex-shrink-0 text-[#001f3f]" />
                        <h4 className="font-semibold text-[#001f3f]">{issue.q}</h4>
                      </div>
                      <p className="ml-8 text-sm text-gray-600">{issue.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section>
          <div className="rounded-lg bg-gradient-to-r from-[#001f3f] to-[#003566] p-8 text-center text-white sm:p-12">
            <MessageCircle className="mx-auto mb-4 h-12 w-12" />
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
              Nu ai găsit soluția la problema ta?
            </h2>
            <p className="mb-8 text-lg text-white/90">
              Echipa noastră de suport este gata să te ajute! Trimite-ne un mesaj și îți vom
              răspunde în maxim 24 ore.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFD700] px-8 py-3 font-semibold text-[#001f3f] transition-transform hover:scale-105"
              >
                <Mail className="h-5 w-5" />
                Contactează Suportul
              </a>
              <a
                href="/faq"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-8 py-3 font-semibold transition-all hover:bg-white hover:text-[#001f3f]"
              >
                <HelpCircle className="h-5 w-5" />
                Vezi FAQ
              </a>
            </div>

            <div className="mt-8 border-t border-white/20 pt-8">
              <p className="text-sm text-white/80">
                Program suport: Luni - Vineri, 09:00 - 17:00
                <br />
                Email:{' '}
                <a
                  href="mailto:contact@campusconnect-scs.work"
                  className="text-[#FFD700] hover:underline"
                >
                  contact@campusconnect-scs.work
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Additional Help */}
        <section className="mt-12">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 text-center">
              <Video className="mx-auto mb-3 h-10 w-10 text-gray-400" />
              <h3 className="mb-2 font-semibold text-gray-700">Tutoriale Video</h3>
              <p className="text-sm text-gray-500">În curând - Ghiduri video pas cu pas</p>
            </div>

            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 text-center">
              <MessageCircle className="mx-auto mb-3 h-10 w-10 text-gray-400" />
              <h3 className="mb-2 font-semibold text-gray-700">Chat Live</h3>
              <p className="text-sm text-gray-500">În curând - Suport instant prin chat</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
