'use client';

import { Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SaveButton } from '@/components/opportunities/SaveButton';

interface OpportunityCardProps {
  title: string;
  department: string;
  description: string;
  category: string;
  location: string;
  hours: string;
  duration: string;
  featured?: boolean;
  hasImage?: boolean;
  imageUrl?: string | null;
  slug?: string;
  activityId: string;
  initialSaved?: boolean;
}

export function OpportunityCard({
  title,
  department,
  description,
  category,
  location,
  hours,
  duration,
  featured,
  hasImage,
  imageUrl,
  slug = 'stem-mentorship-program',
  activityId,
  initialSaved = false,
}: OpportunityCardProps) {
  return (
    <Link
      href={`/opportunities/${slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:shadow-lg"
    >
      {/* Image Placeholder or Real Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : hasImage ? (
          <Image src="/placeholder-activity.jpg" alt={title} fill className="object-cover" />
        ) : null}
        {/* Top badges */}
        <div className="absolute right-3 top-3 flex gap-2">
          {featured && (
            <div className="rounded-full bg-[gold] px-3 py-1 text-xs font-medium text-[#001f3f]">
              Featured
            </div>
          )}
          {/* Save Button */}
          <div className="rounded-full bg-white/90 p-0.5">
            <SaveButton
              activityId={activityId}
              initialSaved={initialSaved}
              size="sm"
              variant="icon"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <h3 className="flex-1 font-medium text-[#001f3f] line-clamp-2">{title}</h3>
          <div className="ml-3 flex size-10 shrink-0 items-center justify-center rounded-full bg-[#001f3f]">
            <span className="text-xs text-white">{department}</span>
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-sm text-gray-500">{description}</p>

        {/* Tags - Fixed height area */}
        <div className="mb-4 flex flex-wrap gap-2 min-h-[56px]">
          <span className="flex items-center gap-1 rounded-full bg-[#001f3f]/10 px-3 py-1 text-xs text-[#001f3f] h-fit">
            <svg className="size-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            {category}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-[#800020]/10 px-3 py-1 text-xs text-[#800020] h-fit">
            <svg className="size-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="line-clamp-1">{location}</span>
          </span>
        </div>

        {/* Footer - Pushed to bottom */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-200 pt-3">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="size-4" />
            <span>{hours}</span>
          </div>
          <span className="text-xs text-gray-500">{duration}</span>
        </div>
      </div>
    </Link>
  );
}
