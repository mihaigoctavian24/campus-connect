'use client';

import { useState, useEffect } from 'react';
import { HoursValidation, HoursRequest } from '@/components/professor/HoursValidation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function ProfessorHoursPage() {
  const [requests, setRequests] = useState<HoursRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  // Fetch hours requests
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

      // Fetch hours requests for activities created by this professor
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
          enrollments (
            id,
            activities (
              id,
              title,
              created_by
            ),
            profiles:user_id (
              id,
              first_name,
              last_name,
              email
            )
          )
        `
        )
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter requests for activities created by this professor
      const professorRequests = (data || [])
        .filter((req: any) => req.enrollments?.activities?.created_by === user.id)
        .map((req: any) => ({
          id: req.id,
          student: {
            id: req.enrollments.profiles.id,
            first_name: req.enrollments.profiles.first_name,
            last_name: req.enrollments.profiles.last_name,
            email: req.enrollments.profiles.email,
          },
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

      setRequests(professorRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Eroare la încărcarea cererilor');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle approve
  const handleApprove = async (requestId: string, notes?: string) => {
    try {
      const response = await fetch(`/api/professor/hours/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Eroare la aprobare');
      }

      // Refresh requests
      await fetchRequests();
    } catch (error) {
      console.error('Approve error:', error);
      throw error;
    }
  };

  // Handle reject
  const handleReject = async (requestId: string, reason: string) => {
    try {
      const response = await fetch(`/api/professor/hours/${requestId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Eroare la respingere');
      }

      // Refresh requests
      await fetchRequests();
    } catch (error) {
      console.error('Reject error:', error);
      throw error;
    }
  };

  // Handle request more info
  const handleRequestInfo = async (requestId: string, message: string) => {
    try {
      const response = await fetch(`/api/professor/hours/${requestId}/request-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Eroare la trimiterea mesajului');
      }

      // Note: Status doesn't change, just send notification
      toast.success('Mesaj trimis studentului');
    } catch (error) {
      console.error('Request info error:', error);
      throw error;
    }
  };

  // Handle bulk approve
  const handleBulkApprove = async (requestIds: string[], notes?: string) => {
    try {
      const response = await fetch('/api/professor/hours/bulk-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestIds, notes }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Eroare la aprobare în masă');
      }

      // Show success message
      toast.success(result.message);

      // Show warnings if any
      if (result.errors && result.errors.length > 0) {
        result.errors.forEach((error: string) => toast.warning(error));
      }

      // Refresh requests
      await fetchRequests();
    } catch (error) {
      console.error('Bulk approve error:', error);
      throw error;
    }
  };

  return (
    <div className="container max-w-6xl py-8">
      <HoursValidation
        requests={requests}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestInfo={handleRequestInfo}
        onBulkApprove={handleBulkApprove}
        isLoading={isLoading}
      />
    </div>
  );
}
