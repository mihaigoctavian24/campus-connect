'use client';

import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Contactează-ne</h1>
          <p className="text-lg text-white/90 sm:text-xl">
            Suntem aici să te ajutăm! Trimite-ne un mesaj și îți vom răspunde în cel mai scurt timp.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Info */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#001f3f]">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#001f3f]">Email</h3>
              <a
                href="mailto:contact@campusconnect-scs.work"
                className="text-gray-600 hover:text-[#001f3f]"
              >
                contact@campusconnect-scs.work
              </a>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#001f3f]">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#001f3f]">Locație</h3>
              <p className="text-gray-600">
                Universitatea Romano-Americană
                <br />
                București, România
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#001f3f]">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#001f3f]">Program Suport</h3>
              <p className="text-gray-600">
                Luni - Vineri
                <br />
                09:00 - 17:00
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-2xl font-bold text-[#001f3f]">Trimite-ne un Mesaj</h2>

              {submitStatus === 'success' && (
                <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800">
                  Mesajul tău a fost trimis cu succes! Îți vom răspunde în curând.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                      Nume Complet
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-700">
                    Subiect
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                    Mesaj
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#001f3f] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#003566] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    'Se trimite...'
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Trimite Mesaj
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
