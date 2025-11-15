import { Search, SlidersHorizontal } from 'lucide-react'
import { OpportunityCard } from '@/components/OpportunityCard'
import { Navigation } from '@/components/Navigation'

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header Section */}
      <section className="border-b border-gray-200 bg-white px-8 py-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-2 text-xl font-medium text-[#001f3f]">Explore Opportunities</h1>
          <p className="text-gray-500">
            Discover volunteer positions that align with your academic goals and interests
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-8 py-8">
        <div className="grid grid-cols-[280px_1fr] gap-8">
          {/* Sidebar Filters */}
          <aside className="space-y-6">
            {/* Filters Header */}
            <div className="flex items-center gap-2 text-sm font-medium text-[#001f3f]">
              <SlidersHorizontal className="size-4" />
              <span>Filters</span>
            </div>

            {/* Search */}
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-[#001f3f] focus:outline-none"
                />
              </div>
            </div>

            {/* Academic Field */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-[#001f3f]">Academic Field</h3>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" className="size-4 rounded border-gray-300" />
                  <span className="text-sm text-gray-700">STEM</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" className="size-4 rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Arts</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" className="size-4 rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Law</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" className="size-4 rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Social Sciences</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" className="size-4 rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Environmental Science</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" className="size-4 rounded border-gray-300" />
                  <span className="text-sm text-gray-700">General</span>
                </label>
              </div>
            </div>

            {/* Project Type */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-[#001f3f]">Project Type</h3>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" className="size-4 rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Mentorship</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" className="size-4 rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Event Support</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" className="size-4 rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Research</span>
                </label>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-[#001f3f]">Location</h3>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" className="size-4 rounded border-gray-300" />
                  <span className="text-sm text-gray-700">On-Campus</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" className="size-4 rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Remote</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" className="size-4 rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Hybrid</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Opportunities Grid */}
          <main>
            {/* Results Count */}
            <p className="mb-6 text-sm text-gray-500">8 opportunities found</p>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-6">
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

              <OpportunityCard
                title="Research Assistant - Psychology Lab"
                department="DP"
                description="Support cutting-edge research in cognitive psychology and gain hands-on research experience."
                category="STEM"
                location="On-Campus"
                hours="8-10 hrs/week"
                duration="Long-term"
                featured
                hasImage
              />

              <OpportunityCard
                title="Campus Tour Guide"
                department="AD"
                description="Welcome prospective students and their families while showcasing campus life and academic opportunities."
                category="General"
                location="On-Campus"
                hours="4-5 hrs/week"
                duration="Short-term"
                hasImage
              />

              <OpportunityCard
                title="Legal Aid Clinic Volunteer"
                department="LC"
                description="Assist in providing free legal services to underserved community members."
                category="Law"
                location="Hybrid"
                hours="6-8 hrs/week"
                duration="Long-term"
              />

              <OpportunityCard
                title="Environmental Sustainability Project"
                department="GG"
                description="Lead campus-wide sustainability initiatives and environmental awareness campaigns."
                category="Environmental Science"
                location="On-Campus"
                hours="4-6 hrs/week"
                duration="Short-term"
                hasImage
              />

              <OpportunityCard
                title="Arts & Culture Event Coordinator"
                department="AC"
                description="Plan and execute arts events, exhibitions, and cultural performances on campus."
                category="Arts"
                location="On-Campus"
                hours="5-7 hrs/week"
                duration="Long-term"
                hasImage
              />

              <OpportunityCard
                title="Peer Academic Tutor"
                department="AT"
                description="Provide one-on-one and group tutoring in your area of academic expertise."
                category="General"
                location="Hybrid"
                hours="4-6 hrs/week"
                duration="Long-term"
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
