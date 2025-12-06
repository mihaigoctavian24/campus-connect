'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { OpportunityCard } from '@/components/OpportunityCard';
import { getOpportunities, type Opportunity } from '@/lib/services/opportunities.service';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function ExplorePage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Dynamic filters from database
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);

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

        // Extract unique categories and locations from all opportunities
        const allData = data; // Use all data to show all available filters
        const uniqueCategories = Array.from(new Set(allData.map((opp) => opp.categoryName))).sort();
        const uniqueLocations = Array.from(new Set(allData.map((opp) => opp.location))).sort();

        setAvailableCategories(uniqueCategories);
        setAvailableLocations(uniqueLocations);
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

  // Filter sidebar component (reusable for desktop and mobile)
  const FiltersSidebar = () => (
    <div className="space-y-6">
      {/* Filters Header */}
      <div className="flex items-center gap-2 text-sm font-medium text-[#001f3f]">
        <SlidersHorizontal className="size-4" />
        <span>Filtre</span>
      </div>

      {/* Search */}
      <div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Caută oportunități..."
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-[#001f3f] focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      {availableCategories.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium text-[#001f3f]">Categorie</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableCategories.map((category) => (
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
      )}

      {/* Location */}
      {availableLocations.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium text-[#001f3f]">Locație</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableLocations.map((location) => (
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
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="border-b border-gray-200 bg-white px-4 py-6 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-2 text-lg font-medium text-[#001f3f] sm:text-xl">
            Explore Opportunities
          </h1>
          <p className="text-sm text-gray-500 sm:text-base">
            Discover volunteer positions that align with your academic goals and interests
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
        {/* Mobile Filter Button */}
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <p className="text-sm text-gray-500">
            {loading
              ? 'Loading...'
              : `${opportunities.length} ${opportunities.length === 1 ? 'opportunity' : 'opportunities'} found`}
          </p>
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="size-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FiltersSidebar />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block">
            <FiltersSidebar />
          </aside>

          {/* Opportunities Grid */}
          <main>
            {/* Desktop Results Count */}
            <div className="mb-6 hidden lg:block">
              {loading ? (
                <p className="text-sm text-gray-500">Loading opportunities...</p>
              ) : (
                <p className="text-sm text-gray-500">
                  {opportunities.length}{' '}
                  {opportunities.length === 1 ? 'opportunity' : 'opportunities'} found
                </p>
              )}
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-200"></div>
                ))}
              </div>
            ) : opportunities.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center sm:p-12">
                <p className="text-base text-gray-500 sm:text-lg">
                  No opportunities found matching your criteria.
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Try adjusting your filters or search query.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                {opportunities.map((opportunity) => (
                  <OpportunityCard
                    key={opportunity.id}
                    activityId={opportunity.id}
                    title={opportunity.title}
                    department={opportunity.departmentCode}
                    description={opportunity.description}
                    category={opportunity.categoryName}
                    location={opportunity.location}
                    hours={`${opportunity.requiredHours} hrs required`}
                    duration="Long-term"
                    slug={opportunity.slug}
                    initialSaved={false}
                    imageUrl={opportunity.imageUrl}
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
