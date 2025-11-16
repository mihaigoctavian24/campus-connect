import { ArrowLeft, MapPin, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { ApplyModal } from '@/components/ApplyModal';

// This would come from database in real implementation
const opportunityData = {
  slug: 'stem-mentorship-program',
  title: 'STEM Mentorship Program',
  department: 'ES',
  departmentFull: 'Engineering Society',
  heroImage: true,
  about:
    "Join our prestigious STEM Mentorship Program where you'll guide first-year engineering students through their academic journey. This is a rewarding opportunity to give back to the community while developing leadership and communication skills.",
  responsibilities: [
    'Meet with mentees weekly for academic guidance',
    'Organize study sessions and workshops',
    'Provide career advice and networking opportunities',
    'Track and report mentee progress',
  ],
  benefits: [
    'Leadership development certificate',
    'Networking with faculty and industry professionals',
    'Letter of recommendation',
    'Community service hours',
  ],
  requiredSkills: ['Communication', 'Leadership', 'Engineering Knowledge'],
  location: 'On-Campus',
  timeCommitment: '5-8 hrs/week',
  duration: 'Long-Term',
  deadline: 'November 30, 2025',
  categories: ['STEM', 'Mentorship'],
};

export default function OpportunityDetailsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button - Absolute positioned */}
      <div className="absolute left-8 top-8 z-10">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#001f3f] shadow-md transition hover:bg-gray-50"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative h-64 bg-gradient-to-br from-gray-300 to-gray-400">
        {/* Hero background */}
      </div>

      <Navigation />

      {/* Department Badge Section */}
      <section className="border-b border-gray-200 bg-white px-8 py-6">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#001f3f]">
            <span className="text-sm font-medium text-white">{opportunityData.department}</span>
          </div>
          <div>
            <h1 className="text-xl font-medium text-[#001f3f]">{opportunityData.title}</h1>
            <p className="text-sm text-gray-500">{opportunityData.departmentFull}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-8 py-8">
        <div className="grid grid-cols-[1fr_380px] gap-8">
          {/* Left Column - Details */}
          <main className="space-y-8">
            {/* About This Opportunity */}
            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-medium text-[#001f3f]">About This Opportunity</h2>
              <p className="text-gray-700 leading-relaxed">{opportunityData.about}</p>
            </section>

            {/* Responsibilities */}
            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-medium text-[#001f3f]">Responsibilities</h2>
              <ul className="space-y-3">
                {opportunityData.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* What You'll Gain */}
            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-medium text-[#001f3f]">What You&apos;ll Gain</h2>
              <ul className="space-y-3">
                {opportunityData.benefits.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 size-2 shrink-0 rounded-full bg-[gold]" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Required Skills */}
            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-medium text-[#001f3f]">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {opportunityData.requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </main>

          {/* Right Column - Key Information */}
          <aside>
            <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-6 font-medium text-[#001f3f]">Key Information</h3>

              <div className="mb-6 space-y-4">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-[#001f3f]">{opportunityData.location}</p>
                  </div>
                </div>

                {/* Time Commitment */}
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Time Commitment</p>
                    <p className="font-medium text-[#001f3f]">{opportunityData.timeCommitment}</p>
                    <p className="text-xs text-gray-400">{opportunityData.duration}</p>
                  </div>
                </div>

                {/* Application Deadline */}
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 size-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Application Deadline</p>
                    <p className="font-medium text-[#001f3f]">{opportunityData.deadline}</p>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <p className="mb-2 text-sm text-gray-500">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {opportunityData.categories.map((category, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-[#001f3f]/10 px-3 py-1 text-xs font-medium text-[#001f3f]"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Apply Now Button */}
              <ApplyModal opportunityTitle={opportunityData.title} />

              {/* Review time */}
              <p className="mt-4 text-center text-xs text-gray-400">
                Applications typically reviewed within 5-7 business days
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
