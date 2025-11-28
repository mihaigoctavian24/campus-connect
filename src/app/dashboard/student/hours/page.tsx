'use client';

import { useState, useEffect } from 'react';
import { HoursHistoryPanel, StudentHoursRequest } from '@/components/student/HoursHistoryPanel';
import { HoursBreakdownChart } from '@/components/student/HoursBreakdownChart';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function StudentHoursPage() {
  const [requests, setRequests] = useState<StudentHoursRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  // Fetch student's hours requests
  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('Nu ești autentificat');
      }

      // Fetch hours requests for this student
      const { data, error } = await supabase
        .from('hours_requests')
        .select(
          `
          id,
          hours,
          date,
          description,
          evidence_urls,
          status,
          created_at,
          approved_at,
          professor_notes,
          enrollments!inner (
            id,
            user_id,
            activities (
              id,
              title
            )
          )
        `
        )
        .eq('enrollments.user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map data to component format
      const studentRequests: StudentHoursRequest[] = (data || []).map((req: any) => ({
        id: req.id,
        activity: {
          id: req.enrollments.activities.id,
          title: req.enrollments.activities.title,
        },
        enrollment_id: req.enrollments.id,
        hours: req.hours,
        date: req.date,
        description: req.description,
        evidence_urls: req.evidence_urls || [],
        status: req.status,
        created_at: req.created_at,
        reviewed_at: req.approved_at,
        professor_notes: req.professor_notes,
      }));

      setRequests(studentRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Eroare la încărcarea istoricului');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      {/* Hours Breakdown Chart */}
      <HoursBreakdownChart requests={requests} />

      {/* Hours History Panel */}
      <HoursHistoryPanel requests={requests} isLoading={isLoading} />
    </div>
  );
}
