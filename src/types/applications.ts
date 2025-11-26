export interface Application {
  id: string;
  user_id: string;
  status: string;
  motivation: string;
  availability: string;
  experience: string;
  applied_at: string;
  reviewed_at: string | null;
  rejection_reason: string | null;
  custom_message: string | null;
  professor_notes: string | null;
  student: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture_url: string | null;
    faculty: string;
    specialization: string;
    year: number;
    program_type: string;
    completed_activities: number;
    certificates_earned: number;
  };
}
