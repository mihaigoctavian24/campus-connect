'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { OpportunityCard } from '@/components/OpportunityCard';
import { getOpportunities, type Opportunity } from '@/lib/services/opportunities.service';

export function OpportunitiesCarousel() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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

  const maxIndex = Math.max(0, opportunities.length - 3);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || opportunities.length <= 3) return;

    const interval = setInterval(goToNext, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext, opportunities.length]);

  // Pause on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-80 rounded-lg bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-500">No opportunities available yet.</p>
      </div>
    );
  }

  const visibleOpportunities = opportunities.slice(currentIndex, currentIndex + 3);
  // If we need more cards to fill 3 slots, wrap around
  while (visibleOpportunities.length < 3 && opportunities.length > 0) {
    const wrapIndex = visibleOpportunities.length - 3 + currentIndex;
    if (wrapIndex >= 0 && wrapIndex < opportunities.length) {
      break;
    }
    visibleOpportunities.push(opportunities[visibleOpportunities.length - 3 + currentIndex + opportunities.length] || opportunities[0]);
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Navigation Buttons */}
      <div className="absolute -left-4 top-1/2 z-10 -translate-y-1/2">
        <button
          onClick={goToPrev}
          className="flex size-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
          aria-label="Previous opportunities"
        >
          <ChevronLeft className="size-6 text-[#001f3f]" />
        </button>
      </div>

      <div className="absolute -right-4 top-1/2 z-10 -translate-y-1/2">
        <button
          onClick={goToNext}
          className="flex size-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
          aria-label="Next opportunities"
        >
          <ChevronRight className="size-6 text-[#001f3f]" />
        </button>
      </div>

      {/* Cards Container */}
      <div className="overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / 3 + 2)}%)`,
            width: `${(opportunities.length / 3) * 100}%`,
          }}
        >
          {opportunities.map((opportunity, index) => (
            <div
              key={opportunity.id}
              className="w-1/3 flex-shrink-0 px-1"
              style={{ opacity: index >= currentIndex && index < currentIndex + 3 ? 1 : 0.5 }}
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
      {opportunities.length > 3 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: Math.ceil(opportunities.length / 3) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i * 3 > maxIndex ? maxIndex : i * 3)}
              className={`h-2 rounded-full transition-all ${
                Math.floor(currentIndex / 3) === i
                  ? 'w-8 bg-[#001f3f]'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
