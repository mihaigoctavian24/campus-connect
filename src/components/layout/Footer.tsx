'use client';

import Link from 'next/link';
import { Github, Star, Mail, MapPin } from 'lucide-react';
import { BorderBeam } from '@/components/ui/border-beam';

const footerLinks = {
  platform: [
    { name: 'Explorează Oportunități', href: '/explore' },
    { name: 'Cum Funcționează', href: '/how-it-works' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Termeni și Condiții', href: '/terms' },
    { name: 'Politica de Confidențialitate', href: '/privacy' },
    { name: 'Cookies', href: '/cookies' },
  ],
  resources: [
    { name: 'Ghid Student', href: '/guides/student' },
    { name: 'Ghid Profesor', href: '/guides/professor' },
    { name: 'Suport', href: '/support' },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-gray-200 bg-gradient-to-b from-white to-gray-50">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#001f3f] to-[#003366]">
                <span className="text-lg font-bold text-white">CC</span>
              </div>
              <span className="text-xl font-bold text-[#001f3f]">CampusConnect</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              Hub de Voluntariat Universitar - Conectăm studenții cu oportunități de voluntariat
              care contează.
            </p>
            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="size-4" />
                <span>București, România</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="size-4" />
                <a href="mailto:contact@campusconnect-scs.work" className="hover:text-[#001f3f]">
                  contact@campusconnect-scs.work
                </a>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="mb-4 font-semibold text-[#001f3f]">Platformă</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-[#001f3f]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="mb-4 font-semibold text-[#001f3f]">Resurse</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-[#001f3f]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* GitHub Section - 3D Card */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 font-semibold text-[#001f3f]">Open Source</h3>
            <div className="relative rounded-2xl">
              <BorderBeam
                size={68}
                duration={6}
                colorFrom="#ffaa40"
                colorTo="#9c40ff"
                borderWidth={6}
              />
              <a
                href="https://github.com/mihaigoctavian24/campus-connect"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6"
              >
                {/* Content */}
                <div className="flex items-center gap-6">
                  {/* GitHub Icon */}
                  <div className="relative">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600">
                      <Github className="size-8 text-white" />
                    </div>
                    {/* Star badge */}
                    <div className="absolute -right-2 -top-2">
                      <Star className="size-5 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-1">CampusConnect</h4>
                    <p className="text-sm text-gray-400 mb-3">
                      Hub de Voluntariat Universitar - Open Source
                    </p>

                    <div className="flex items-center gap-3">
                      {/* Star button */}
                      <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white border border-white/10">
                        <Star className="size-4 fill-yellow-400 text-yellow-400" />
                        <span>Star</span>
                      </div>

                      {/* View code */}
                      <div className="flex items-center gap-1.5 text-sm text-gray-400 group-hover:text-white transition-colors">
                        <span>Vezi codul sursă</span>
                        <svg
                          className="size-4 transition-transform group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            {/* Legal Links - compact */}
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-400">
              {footerLinks.legal.map((link, i) => (
                <span key={link.name} className="flex items-center gap-2">
                  <Link href={link.href} className="hover:text-[#001f3f] transition-colors">
                    {link.name}
                  </Link>
                  {i < footerLinks.legal.length - 1 && <span>•</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Simple & Centered */}
      <div className="border-t border-gray-200 bg-[#001f3f]">
        <div className="mx-auto max-w-7xl px-8 py-4">
          <p className="flex items-center justify-center gap-1 text-center text-sm text-white/70">
            <span>© {currentYear} - Creat cu</span>
            <span
              className="inline-block text-red-500"
              style={{
                animation: 'heartbeat 1s ease-in-out infinite',
              }}
            >
              ❤️
            </span>
            <style jsx>{`
              @keyframes heartbeat {
                0% {
                  transform: scale(1);
                }
                14% {
                  transform: scale(1.3);
                }
                28% {
                  transform: scale(1);
                }
                42% {
                  transform: scale(1.25);
                }
                56% {
                  transform: scale(1);
                }
                100% {
                  transform: scale(1);
                }
              }
            `}</style>
            <span>de Bubu & Dudu Dev Team</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
