'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Play, Pause } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-[600px] overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          onCanPlay={() => setIsLoaded(true)}
        >
          <source
            src="https://videos.pexels.com/video-files/3209211/3209211-uhd_2560_1440_25fps.mp4"
            type="video/mp4"
          />
        </video>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001f3f]/95 via-[#001f3f]/80 to-[#800020]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/90 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-8 py-32">
        <div className={`max-w-3xl transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge with animation */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-[gold] shadow-lg shadow-[gold]/30 animate-pulse">
              <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <span className="text-[gold] font-medium tracking-wide animate-fade-in">
              Excellence Through Service
            </span>
          </div>

          {/* Heading with stagger animation */}
          <h1
            className={`mb-6 text-5xl md:text-6xl font-bold leading-tight text-white transition-all duration-1000 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="block">Your Journey of</span>
            <span className="block bg-gradient-to-r from-[gold] to-yellow-300 bg-clip-text text-transparent">
              Impact Starts Here
            </span>
          </h1>

          {/* Description */}
          <p
            className={`mb-10 text-xl leading-relaxed text-white/90 transition-all duration-1000 delay-400 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Connect with meaningful volunteer opportunities that complement your academic journey
            and build the leadership skills that define tomorrow&apos;s changemakers.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-wrap gap-4 transition-all duration-1000 delay-600 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Link
              href="/explore"
              className="group inline-flex items-center gap-2 rounded-lg bg-[gold] px-8 py-4 font-medium text-[#001f3f] shadow-lg shadow-[gold]/30 transition-all hover:bg-yellow-400 hover:shadow-xl hover:shadow-[gold]/40 hover:scale-105"
            >
              Explore Opportunities
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/auth/signup"
              className="group inline-flex items-center gap-2 rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/50"
            >
              Join Now
            </Link>
          </div>
        </div>

        {/* Floating Stats Preview */}
        <div
          className={`absolute bottom-8 right-8 hidden lg:flex items-center gap-6 transition-all duration-1000 delay-800 ${
            isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}
        >
          <div className="text-right">
            <p className="text-3xl font-bold text-[gold]">50+</p>
            <p className="text-sm text-white/70">Active Projects</p>
          </div>
          <div className="h-12 w-px bg-white/30" />
          <div className="text-right">
            <p className="text-3xl font-bold text-[gold]">1,500+</p>
            <p className="text-sm text-white/70">Hours Contributed</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/50 text-xs uppercase tracking-widest">Scroll</span>
          <svg
            className="size-6 text-white/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
