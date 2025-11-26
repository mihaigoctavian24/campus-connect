export interface StudentProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  profilePictureUrl: string | null;
  faculty: string | null;
  specialization: string | null;
  year: number | null;
  programType: string | null;
  gpa: number | null;
  memberSince: string;
}

export interface CompletedActivity {
  id: string;
  title: string;
  date: string;
  categoryName: string | null;
  categoryColor: string | null;
  enrolledAt: string;
  attendanceStatus: string | null;
}

export interface StudentStats {
  totalVolunteerHours: number;
  attendanceRate: number;
  totalActivitiesEnrolled: number;
  totalActivitiesAttended: number;
}

export interface StudentProfileResponse {
  profile: StudentProfile;
  completedActivities: CompletedActivity[];
  stats: StudentStats;
}
