'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { StudentProfileResponse } from '@/types/student-profile';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

interface StudentProfileModalProps {
  studentId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StudentProfileModal({ studentId, isOpen, onClose }: StudentProfileModalProps) {
  const [profileData, setProfileData] = useState<StudentProfileResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && studentId) {
      fetchStudentProfile();
    }
  }, [isOpen, studentId]);

  const fetchStudentProfile = async () => {
    if (!studentId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/students/${studentId}/profile`);

      if (!response.ok) {
        throw new Error('Failed to fetch student profile');
      }

      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      console.error('Error fetching student profile:', err);
      setError('Nu s-a putut încărca profilul studentului');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profil Student</DialogTitle>
          <DialogDescription>
            Informații detaliate despre student și activitatea sa
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {!loading && !error && profileData && (
          <div className="space-y-6">
            {/* Header with Avatar and Name */}
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileData.profile.profilePictureUrl || undefined} />
                <AvatarFallback className="text-lg">
                  {getInitials(profileData.profile.firstName, profileData.profile.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold">
                  {profileData.profile.firstName} {profileData.profile.lastName}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Mail className="h-4 w-4" />
                  <span>{profileData.profile.email}</span>
                </div>
                {profileData.profile.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Phone className="h-4 w-4" />
                    <span>{profileData.profile.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Academic Info */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Informații Academice
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Facultate</p>
                  <p className="font-medium">{profileData.profile.faculty || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Specializare</p>
                  <p className="font-medium">{profileData.profile.specialization || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">An de studiu</p>
                  <p className="font-medium">
                    {profileData.profile.year ? `Anul ${profileData.profile.year}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tip program</p>
                  <p className="font-medium capitalize">
                    {profileData.profile.programType || 'N/A'}
                  </p>
                </div>
                {profileData.profile.gpa !== null && (
                  <div>
                    <p className="text-sm text-muted-foreground">Medie (GPA)</p>
                    <p className="font-medium flex items-center gap-2">
                      {profileData.profile.gpa.toFixed(2)}
                      <Badge variant="secondary" className="text-xs">
                        / 10
                      </Badge>
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Membru din</p>
                  <p className="font-medium">
                    {format(new Date(profileData.profile.memberSince), 'MMMM yyyy', { locale: ro })}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Statistics */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Statistici Voluntariat
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-accent rounded-lg">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{profileData.stats.totalVolunteerHours}</p>
                  <p className="text-sm text-muted-foreground">Ore totale</p>
                </div>
                <div className="text-center p-4 bg-accent rounded-lg">
                  <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold">{profileData.stats.attendanceRate}%</p>
                  <p className="text-sm text-muted-foreground">Rată prezență</p>
                </div>
                <div className="text-center p-4 bg-accent rounded-lg">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">{profileData.stats.totalActivitiesAttended}</p>
                  <p className="text-sm text-muted-foreground">
                    din {profileData.stats.totalActivitiesEnrolled} activități
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Previous Activities */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-5 w-5" />
                Activități Anterioare
              </h4>
              {profileData.completedActivities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nicio activitate completată încă
                </p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {profileData.completedActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{activity.title}</p>
                          {activity.categoryName && (
                            <Badge
                              variant="outline"
                              style={{
                                borderColor: activity.categoryColor || undefined,
                                color: activity.categoryColor || undefined,
                              }}
                            >
                              {activity.categoryName}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(new Date(activity.date), 'dd MMMM yyyy', { locale: ro })}
                        </p>
                      </div>
                      {activity.attendanceStatus && (
                        <Badge
                          variant={
                            activity.attendanceStatus === 'PRESENT' ||
                            activity.attendanceStatus === 'COMPLETED'
                              ? 'default'
                              : 'secondary'
                          }
                          className="ml-2"
                        >
                          {activity.attendanceStatus === 'PRESENT' ||
                          activity.attendanceStatus === 'COMPLETED'
                            ? 'Prezent'
                            : 'Absent'}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
