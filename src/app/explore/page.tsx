'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { OpportunityCard } from '@/components/OpportunityCard';
import { getOpportunities, type Opportunity } from '@/lib/services/opportunities.service';

export default function ExplorePage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  useEffect(() => {
    async function loadOpportunities() {
      try {
        setLoading(true);
        const data = await getOpportunities({
          search: searchQuery || undefined,
          category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
          status: 'OPEN',
        });

        // Client-side filtering for location since backend doesn't support it yet
        let filtered = data;
        if (selectedLocations.length > 0) {
          filtered = data.filter((opp) => selectedLocations.includes(opp.location));
        }

        setOpportunities(filtered);
      } catch (error) {
        console.error('Failed to load opportunities:', error);
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    }

    loadOpportunities();
  }, [searchQuery, selectedCategories, selectedLocations]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleLocationToggle = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header is now in root layout */}

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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Academic Field / Categories */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-[#001f3f]">Category</h3>
              <div className="space-y-2">
                {[
                  'Academic Support',
                  'Community Service',
                  'Event Assistance',
                  'Mentorship',
                  'Research',
                  'Technical',
                ].map((category) => (
                  <label key={category} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      className="size-4 rounded border-gray-300"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-[#001f3f]">Location</h3>
              <div className="space-y-2">
                {['On-Campus', 'Remote', 'Hybrid'].map((location) => (
                  <label key={location} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      className="size-4 rounded border-gray-300"
                      checked={selectedLocations.includes(location)}
                      onChange={() => handleLocationToggle(location)}
                    />
                    <span className="text-sm text-gray-700">{location}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Opportunities Grid */}
          <main>
            {/* Results Count */}
            {loading ? (
              <p className="mb-6 text-sm text-gray-500">Loading opportunities...</p>
            ) : (
              <p className="mb-6 text-sm text-gray-500">
                {opportunities.length}{' '}
                {opportunities.length === 1 ? 'opportunity' : 'opportunities'} found
              </p>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : opportunities.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-500 text-lg">
                  No opportunities found matching your criteria.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your filters or search query.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {opportunities.map((opportunity) => (
                  <OpportunityCard
                    key={opportunity.id}
                    title={opportunity.title}
                    department={opportunity.departmentCode}
                    description={opportunity.description}
                    category={opportunity.categoryName}
                    location={opportunity.location}
                    hours={`${opportunity.requiredHours} hrs required`}
                    duration="Long-term"
                    slug={opportunity.slug}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
