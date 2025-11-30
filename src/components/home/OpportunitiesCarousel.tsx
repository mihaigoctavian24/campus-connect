'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { OpportunityCard } from '@/components/OpportunityCard';
import { getOpportunities, type Opportunity } from '@/lib/services/opportunities.service';

// Hook to get responsive items per page
function useItemsPerPage() {
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setItemsPerPage(1); // Mobile: 1 card
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2); // Tablet: 2 cards
      } else {
        setItemsPerPage(3); // Desktop: 3 cards
      }
    }

    // Set initial value
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return itemsPerPage;
}

export function OpportunitiesCarousel() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = useItemsPerPage();

  useEffect(() => {
    async function loadOpportunities() {
      try {
        const data = await getOpportunities({ status: 'OPEN', limit: 9 });
        setOpportunities(data);
      } catch (error) {
        console.error('Failed to load opportunities:', error);
      } finally {
        setLoading(false);
      }
    }
    loadOpportunities();
  }, []);

  const totalPages = Math.ceil(opportunities.length / itemsPerPage);

  // Reset currentIndex when itemsPerPage changes to avoid out-of-bounds
  useEffect(() => {
    if (currentIndex >= totalPages && totalPages > 0) {
      setCurrentIndex(0);
    }
  }, [itemsPerPage, totalPages, currentIndex]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || totalPages <= 1) return;

    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext, totalPages]);

  // Pause on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto px-4 md:px-0">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-[420px] rounded-2xl bg-gray-200 animate-pulse ${i === 2 ? 'hidden md:block' : ''} ${i === 3 ? 'hidden lg:block' : ''}`}
          />
        ))}
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center max-w-2xl mx-auto">
        <p className="text-gray-500">No opportunities available yet.</p>
      </div>
    );
  }

  // Calculate card width - on mobile (1 item) use 100%, otherwise calculate based on itemsPerPage
  const gap = itemsPerPage === 1 ? 0 : 24; // No gap needed for single card on mobile
  const cardWidthCalc =
    itemsPerPage === 1
      ? '100%'
      : `calc(${100 / itemsPerPage}% - ${(gap * (itemsPerPage - 1)) / itemsPerPage}px)`;

  return (
    <div
      className="relative px-4 md:px-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Navigation Buttons */}
      {totalPages > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-0 md:left-4 top-1/2 z-10 -translate-y-1/2 flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white/90 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg hover:scale-110"
            aria-label="Previous opportunities"
          >
            <ChevronLeft className="size-5 text-[#001f3f]" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 md:right-4 top-1/2 z-10 -translate-y-1/2 flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white/90 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg hover:scale-110"
            aria-label="Next opportunities"
          >
            <ChevronRight className="size-5 text-[#001f3f]" />
          </button>
        </>
      )}

      {/* Sliding Cards Container */}
      <div className="overflow-hidden mx-auto max-w-5xl px-6 md:px-0" ref={containerRef}>
        <div
          className="flex"
          style={{
            transform:
              itemsPerPage === 1
                ? `translateX(-${currentIndex * 100}%)`
                : `translateX(calc(-${currentIndex * 100}% - ${currentIndex * gap}px))`,
            gap: gap > 0 ? `${gap}px` : undefined,
            transition: 'transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {opportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="h-[420px] flex-shrink-0"
              style={{ width: cardWidthCalc }}
            >
              <OpportunityCard
                activityId={opportunity.id}
                title={opportunity.title}
                department={opportunity.departmentCode}
                description={opportunity.description}
                category={opportunity.categoryName}
                location={opportunity.location}
                hours={`${opportunity.requiredHours} hrs required`}
                duration="Long-term"
                slug={opportunity.slug}
                imageUrl={opportunity.imageUrl}
                featured
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-3">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-3 rounded-full transition-all duration-300 ${
                currentIndex === i ? 'w-10 bg-[#001f3f]' : 'w-3 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
