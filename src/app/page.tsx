import { ArrowRight, Users, Clock, Building2 } from 'lucide-react';
import Link from 'next/link';
import { OpportunityCard } from '@/components/OpportunityCard';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header is now in root layout */}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#001f3f] via-[#001f3f] via-50% to-[#800020] py-24">
        <div className="mx-auto max-w-7xl px-8">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-[gold]">
                <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <span className="text-[gold]">Excellence Through Service</span>
            </div>

            {/* Heading */}
            <h1 className="mb-6 text-6xl font-normal leading-tight text-white">
              Your Module of Impact Starts Here.
            </h1>

            {/* Description */}
            <p className="mb-10 text-xl leading-relaxed text-white/90">
              Connect with meaningful volunteer opportunities that complement your academic journey
              and build the leadership skills that define tomorrow&apos;s changemakers.
            </p>

            {/* CTA Button */}
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-lg bg-[gold] px-8 py-4 font-medium text-[#001f3f] shadow-lg transition hover:bg-[gold]/90"
            >
              Explore Opportunities
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Widget */}
      <section className="relative -mt-12 px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-6">
          {/* Active Projects */}
          <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex size-14 items-center justify-center rounded-lg bg-[#001f3f]">
              <Users className="size-7 text-white" />
            </div>
            <div>
              <p className="text-xl font-medium text-[#001f3f]">50+</p>
              <p className="text-gray-500">Active Projects</p>
            </div>
          </div>

          {/* Volunteer Hours */}
          <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex size-14 items-center justify-center rounded-lg bg-[#001f3f]">
              <Clock className="size-7 text-white" />
            </div>
            <div>
              <p className="text-xl font-medium text-[#001f3f]">1,500+</p>
              <p className="text-gray-500">Volunteer Hours</p>
            </div>
          </div>

          {/* Partner Organizations */}
          <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex size-14 items-center justify-center rounded-lg bg-[#001f3f]">
              <Building2 className="size-7 text-white" />
            </div>
            <div>
              <p className="text-xl font-medium text-[#001f3f]">30</p>
              <p className="text-gray-500">Partner Organizations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="px-8 py-16">
        <div className="mx-auto max-w-7xl rounded-lg border border-gray-200 bg-white px-48 py-12 text-center">
          <h2 className="mb-4 text-xl font-medium text-[#001f3f]">Empowering Student Leaders</h2>
          <p className="text-center text-gray-500">
            CampusConnect bridges academic excellence with community engagement. Our platform
            connects ambitious students with volunteer opportunities that align with their field of
            study, career goals, and passion for making a difference. Join a community of scholars
            dedicated to service.
          </p>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="px-8 py-16">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-medium text-[#001f3f]">Featured Opportunities</h2>
            <div className="flex gap-2">
              <button className="flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white opacity-40">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button className="flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white opacity-40">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Opportunity Cards */}
          <div className="grid grid-cols-3 gap-6">
            {/* Card 1 */}
            <OpportunityCard
              title="STEM Mentorship Program"
              department="ES"
              description="Guide first-year engineering students through their academic journey and help them develop essential skills."
              category="STEM"
              location="On-Campus"
              hours="5-8 hrs/week"
              duration="Long-term"
              featured
            />

            {/* Card 2 */}
            <OpportunityCard
              title="Community Outreach Coordinator"
              department="SVC"
              description="Coordinate volunteer events and connect students with local community organizations."
              category="Social Sciences"
              location="Hybrid"
              hours="10-12 hrs/week"
              duration="Long-term"
              featured
            />

            {/* Card 3 */}
            <OpportunityCard
              title="Research Assistant - Psychology Lab"
              department="DP"
              description="Support cutting-edge research in cognitive psychology and gain hands-on research experience."
              category="STEM"
              location="On-Campus"
              hours="8-10 hrs/week"
              duration="Long-term"
              featured
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-16">
        <div className="mx-auto max-w-7xl rounded-lg bg-gradient-to-b from-[#800020] to-[#001f3f] px-12 py-12 text-center shadow-xl">
          <h2 className="mb-4 text-lg font-medium text-white">Ready to Make an Impact?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-white/90">
            Browse our full catalog of volunteer opportunities and find the perfect match for your
            skills, interests, and schedule.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-lg bg-[gold] px-8 py-4 font-medium text-[#001f3f] shadow-lg transition hover:bg-[gold]/90"
          >
            View All Opportunities
          </Link>
        </div>
      </section>
    </div>
  );
}
