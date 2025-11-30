import { Users, Clock, Building2, Sparkles, Heart, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { HeroSection } from '@/components/home/HeroSection';
import { AnimatedCounter } from '@/components/home/AnimatedCounter';
import { OpportunitiesCarousel } from '@/components/home/OpportunitiesCarousel';
import { FadeInSection } from '@/components/home/FadeInSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Video Background */}
      <HeroSection />

      {/* Statistics Widget */}
      <section className="relative -mt-16 z-20 px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-3 gap-6">
          <FadeInSection delay={0}>
            <div className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-[gold] to-yellow-500 shadow-lg shadow-[gold]/20">
                <Users className="size-7 text-[#001f3f]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#001f3f]">
                  <AnimatedCounter end={50} suffix="+" duration={2000} />
                </p>
                <p className="text-gray-500">Active Projects</p>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={150}>
            <div className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-[gold] to-yellow-500 shadow-lg shadow-[gold]/20">
                <Clock className="size-7 text-[#001f3f]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#001f3f]">
                  <AnimatedCounter end={1500} suffix="+" duration={2500} />
                </p>
                <p className="text-gray-500">Volunteer Hours</p>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={300}>
            <div className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-[gold] to-yellow-500 shadow-lg shadow-[gold]/20">
                <Building2 className="size-7 text-[#001f3f]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#001f3f]">
                  <AnimatedCounter end={30} suffix="+" duration={1800} />
                </p>
                <p className="text-gray-500">Partner Organizations</p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="px-8 py-20">
        <FadeInSection>
          <div className="mx-auto max-w-7xl">
            <div className="relative rounded-2xl border border-gray-200 bg-white overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[gold]/10 to-transparent rounded-br-full" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-[#001f3f]/5 to-transparent rounded-tl-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-[gold]/5 to-transparent rounded-full blur-3xl" />

              <div className="relative px-8 md:px-16 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#001f3f] mb-4">
                    Empowering Student Leaders
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Conectăm studenții cu oportunități de voluntariat care
                    <span className="text-[#001f3f] font-semibold"> transformă comunități</span> și
                    <span className="text-[#001f3f] font-semibold"> construiesc cariere</span>.
                  </p>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100 hover:border-[gold]/30 hover:shadow-lg hover:shadow-[gold]/5 transition-all duration-300">
                    <GraduationCap className="size-10 text-[#001f3f] mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-[#001f3f] text-lg mb-2">Creștere Academică</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Aplică teoria în practică. Câștigă experiență reală care completează studiile
                      tale.
                    </p>
                  </div>

                  <div className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100 hover:border-[gold]/30 hover:shadow-lg hover:shadow-[gold]/5 transition-all duration-300">
                    <Heart className="size-10 text-[#001f3f] mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-[#001f3f] text-lg mb-2">Impact Real</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Fă diferența în comunitate. Fiecare oră de voluntariat contează și schimbă
                      vieți.
                    </p>
                  </div>

                  <div className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100 hover:border-[gold]/30 hover:shadow-lg hover:shadow-[gold]/5 transition-all duration-300">
                    <Sparkles className="size-10 text-[#001f3f] mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-[#001f3f] text-lg mb-2">Skills de Lider</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Dezvoltă competențe esențiale: comunicare, organizare, leadership și teamwork.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* Featured Opportunities Carousel */}
      <section className="px-8 py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl">
          <FadeInSection>
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-[#001f3f] mb-4">Featured Opportunities</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Browse our curated selection of volunteer opportunities and find the perfect match
                for your skills and interests.
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={200}>
            <OpportunitiesCarousel />
          </FadeInSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-20">
        <FadeInSection>
          <div className="mx-auto max-w-7xl">
            <div className="relative rounded-2xl overflow-hidden">
              {/* Background with gradient and pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#001f3f] via-[#002a52] to-[#800020]" />
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />

              <div className="relative px-12 py-16 text-center">
                <h2 className="mb-4 text-3xl font-bold text-white">Ready to Make an Impact?</h2>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
                  Browse our full catalog of volunteer opportunities and find the perfect match for
                  your skills, interests, and schedule.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/explore"
                    className="group inline-flex items-center gap-2 rounded-lg bg-[gold] px-8 py-4 font-medium text-[#001f3f] shadow-lg shadow-[gold]/30 transition-all hover:bg-yellow-400 hover:shadow-xl hover:scale-105"
                  >
                    View All Opportunities
                    <svg
                      className="size-5 transition-transform group-hover:translate-x-1"
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
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/50"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>
    </div>
  );
}
