'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { ApplyModal } from '@/components/opportunities/ApplyModal';
import { SaveButton } from '@/components/opportunities/SaveButton';
import { Badge } from '@/components/ui/badge';
import { getOpportunityBySlug, type Opportunity } from '@/lib/services/opportunities.service';
import { createClient } from '@/lib/supabase/client';

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';

export default function OpportunityDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState<{ id: string; status: string } | null>(null);
  const [sessions, setSessions] = useState<{ id: string; date: string; start_time: string; end_time: string; location: string; status: string }[]>([]);

  useEffect(() => {
    async function loadOpportunity() {
      try {
        const supabase = createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        // Fetch opportunity data
        const opportunityData = await getOpportunityBySlug(slug);

        if (!opportunityData) {
          setLoading(false);
          return;
        }

        setOpportunity(opportunityData);

        // Fetch sessions for this activity
        const { data: sessionsData } = await supabase
          .from('sessions')
          .select('*')
          .eq('activity_id', opportunityData.id)
          .order('date', { ascending: true })
          .order('start_time', { ascending: true });

        if (sessionsData) {
          setSessions(sessionsData);
        }

        // Check if user is already enrolled
        if (user) {
          const { data: enrollmentData } = await supabase
            .from('enrollments')
            .select('id, status')
            .eq('activity_id', opportunityData.id)
            .eq('user_id', user.id)
            .is('deleted_at', null)
            .maybeSingle<{ id: string; status: string }>();

          if (enrollmentData) {
            setEnrollment(enrollmentData);
          }
        }
      } catch (error) {
        console.error('Error loading opportunity:', error);
      } finally {
        setLoading(false);
      }
    }

    loadOpportunity();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001f3f] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading opportunity...</p>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Opportunity Not Found</h1>
          <p className="text-gray-600 mb-4">The opportunity you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#001f3f] text-white rounded-lg hover:bg-[#001f3f]/90"
          >
            <ArrowLeft className="size-4" />
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  // Calculate spots remaining
  const spotsRemaining = opportunity.maxParticipants - opportunity.currentParticipants;
  const isFull = spotsRemaining <= 0;
  const isLimitedSpots = spotsRemaining > 0 && spotsRemaining <= 5;

  // Format dates
  const startDate = new Date(opportunity.startDate);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Get enrollment status badge
  const getEnrollmentBadge = () => {
    if (!enrollment) return null;

    const statusConfig: Record<string, { label: string; className: string }> = {
      PENDING: { label: 'Application Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      APPROVED: { label: 'Enrolled', className: 'bg-green-100 text-green-800 border-green-200' },
      REJECTED: { label: 'Application Rejected', className: 'bg-red-100 text-red-800 border-red-200' },
      WITHDRAWN: { label: 'Withdrawn', className: 'bg-gray-100 text-gray-800 border-gray-200' },
    };

    const config = statusConfig[enrollment.status] || {
      label: enrollment.status,
      className: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#001f3f]">
              <span className="text-sm font-medium text-white">{opportunity.departmentCode}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-medium text-[#001f3f]">{opportunity.title}</h1>
                {enrollment && getEnrollmentBadge()}
              </div>
              <p className="text-sm text-gray-500">{opportunity.departmentName}</p>
            </div>
          </div>
          {/* Save Button */}
          <SaveButton activityId={opportunity.id} size="lg" variant="button" />
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
              <p className="text-gray-700 leading-relaxed">{opportunity.description}</p>
            </section>

            {/* Category */}
            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-medium text-[#001f3f]">Category</h2>
              <Badge variant="secondary" className="text-sm">
                {opportunity.categoryName}
              </Badge>
            </section>

            {/* Sessions List */}
            {sessions.length > 0 && (
              <section className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-medium text-[#001f3f]">Sessions Schedule</h2>
                <div className="space-y-3">
                  {sessions.map((session) => {
                    const sessionDate = new Date(session.date);
                    const formattedSessionDate = sessionDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    });

                    const getSessionStatusBadge = () => {
                      const statusConfig: Record<string, { label: string; className: string }> = {
                        SCHEDULED: { label: 'Scheduled', className: 'bg-blue-100 text-blue-800 border-blue-200' },
                        IN_PROGRESS: { label: 'In Progress', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                        COMPLETED: { label: 'Completed', className: 'bg-green-100 text-green-800 border-green-200' },
                        CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-800 border-red-200' },
                      };

                      const config = statusConfig[session.status] || {
                        label: session.status,
                        className: 'bg-gray-100 text-gray-800 border-gray-200'
                      };

                      return (
                        <Badge variant="outline" className={`text-xs ${config.className}`}>
                          {config.label}
                        </Badge>
                      );
                    };

                    return (
                      <div
                        key={session.id}
                        className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 p-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="size-4 text-gray-400" />
                            <span className="font-medium text-[#001f3f]">{formattedSessionDate}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-1 text-sm text-gray-600">
                            <Clock className="size-3.5 text-gray-400" />
                            <span>{session.start_time} - {session.end_time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="size-3.5 text-gray-400" />
                            <span>{session.location}</span>
                          </div>
                        </div>
                        <div>
                          {getSessionStatusBadge()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </main>

          {/* Right Column - Key Information */}
          <aside>
            <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-6 font-medium text-[#001f3f]">Key Information</h3>

              <div className="mb-6 space-y-4">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 size-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-[#001f3f]">{formattedDate}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-[#001f3f]">{opportunity.location}</p>
                  </div>
                </div>

                {/* Required Hours */}
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Required Hours</p>
                    <p className="font-medium text-[#001f3f]">{opportunity.requiredHours} hours</p>
                  </div>
                </div>

                {/* Participants */}
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 size-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Participants</p>
                    <p className="font-medium text-[#001f3f]">
                      {opportunity.currentParticipants}/{opportunity.maxParticipants}
                    </p>
                    {isLimitedSpots && (
                      <p className="text-xs text-orange-600 font-medium mt-1">
                        Only {spotsRemaining} spots left!
                      </p>
                    )}
                    {isFull && (
                      <p className="text-xs text-red-600 font-medium mt-1">
                        This opportunity is full
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-6">
                <p className="mb-2 text-sm text-gray-500">Status</p>
                {isFull && (
                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                    Full
                  </Badge>
                )}
                {isLimitedSpots && (
                  <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                    {spotsRemaining} spots left
                  </Badge>
                )}
                {!isFull && !isLimitedSpots && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    Open
                  </Badge>
                )}
              </div>

              {/* Apply Now Button */}
              <ApplyModal
                activityId={opportunity.id}
                opportunityTitle={opportunity.title}
                disabled={!!enrollment || isFull}
              />

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
