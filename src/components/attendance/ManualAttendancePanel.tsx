'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Users, CheckCircle, XCircle, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface EnrolledStudent {
  id: string; // enrollment_id
  user_id: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
  attendance?: {
    id: string;
    status: 'PRESENT' | 'ABSENT' | 'EXCUSED' | 'LATE';
    check_in_method: string;
    notes: string | null;
  };
}

interface ManualAttendancePanelProps {
  sessionId: string;
  activityId: string;
}

interface StudentAttendanceState {
  enrollmentId: string;
  status: 'PRESENT' | 'ABSENT' | 'EXCUSED' | 'LATE' | null;
  notes: string;
}

export function ManualAttendancePanel({ sessionId, activityId }: ManualAttendancePanelProps) {
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [attendanceState, setAttendanceState] = useState<Record<string, StudentAttendanceState>>(
    {}
  );
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  // Fetch enrolled students and their attendance
  useEffect(() => {
    fetchStudents();
  }, [sessionId, activityId]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      // Get confirmed enrollments
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select(
          `
          id,
          user_id,
          profiles!enrollments_user_id_fkey (
            first_name,
            last_name,
            email
          )
        `
        )
        .eq('activity_id', activityId)
        .eq('status', 'CONFIRMED')
        .order('profiles(last_name)', { ascending: true });

      if (enrollError) throw enrollError;

      // Get existing attendance for this session
      const { data: attendance, error: attendError } = await supabase
        .from('attendance')
        .select('*')
        .eq('session_id', sessionId);

      if (attendError) throw attendError;

      // Merge enrollment with attendance data
      const studentsWithAttendance = (enrollments || []).map((enrollment: any) => {
        const existingAttendance = attendance?.find((a: any) => a.enrollment_id === enrollment.id);

        return {
          ...enrollment,
          attendance: existingAttendance || undefined,
        };
      });

      setStudents(studentsWithAttendance);

      // Initialize attendance state
      const initialState: Record<string, StudentAttendanceState> = {};
      studentsWithAttendance.forEach((student: any) => {
        initialState[student.id] = {
          enrollmentId: student.id,
          status: student.attendance?.status || null,
          notes: student.attendance?.notes || '',
        };
      });
      setAttendanceState(initialState);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Eroare la încărcarea studenților');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (enrollmentId: string, status: string) => {
    setAttendanceState((prev) => ({
      ...prev,
      [enrollmentId]: {
        ...prev[enrollmentId],
        status: status as 'PRESENT' | 'ABSENT' | 'EXCUSED' | 'LATE',
      },
    }));
  };

  const handleNotesChange = (enrollmentId: string, notes: string) => {
    setAttendanceState((prev) => ({
      ...prev,
      [enrollmentId]: {
        ...prev[enrollmentId],
        notes,
      },
    }));
  };

  const handleSelectStudent = (enrollmentId: string, checked: boolean) => {
    setSelectedStudents((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(enrollmentId);
      } else {
        newSet.delete(enrollmentId);
      }
      return newSet;
    });
  };

  const handleBulkMarkPresent = () => {
    if (selectedStudents.size === 0) {
      toast.error('Selectează cel puțin un student');
      return;
    }

    const newState = { ...attendanceState };
    selectedStudents.forEach((enrollmentId) => {
      newState[enrollmentId] = {
        ...newState[enrollmentId],
        status: 'PRESENT',
      };
    });
    setAttendanceState(newState);
    toast.success(`${selectedStudents.size} studenți marcați ca prezenți`);
  };

  const handleBulkMarkAbsent = () => {
    if (selectedStudents.size === 0) {
      toast.error('Selectează cel puțin un student');
      return;
    }

    const newState = { ...attendanceState };
    selectedStudents.forEach((enrollmentId) => {
      newState[enrollmentId] = {
        ...newState[enrollmentId],
        status: 'ABSENT',
      };
    });
    setAttendanceState(newState);
    toast.success(`${selectedStudents.size} studenți marcați ca absenți`);
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      let updatedCount = 0;

      for (const [enrollmentId, state] of Object.entries(attendanceState)) {
        if (!state.status) continue; // Skip students without status

        const student = students.find((s) => s.id === enrollmentId);
        if (!student) continue;

        // Check if attendance already exists
        const existingAttendance = student.attendance;

        if (existingAttendance) {
          // Update existing attendance
          const { error } = await supabase
            .from('attendance')
            .update({
              status: state.status,
              notes: state.notes || null,
              check_in_method: 'MANUAL',
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingAttendance.id);

          if (error) throw error;
        } else {
          // Create new attendance record
          const { error } = await supabase.from('attendance').insert({
            session_id: sessionId,
            enrollment_id: enrollmentId,
            user_id: student.user_id,
            status: state.status,
            notes: state.notes || null,
            check_in_method: 'MANUAL',
            checked_in_at: new Date().toISOString(),
          });

          if (error) throw error;
        }

        updatedCount++;
      }

      toast.success(`Prezența salvată pentru ${updatedCount} studenți`);

      // TODO: Send email notifications (Week 21-22: Platform Configuration)
      // - Students marked present: "Prezența ta a fost confirmată"
      // - Students marked absent: "Nu ai fost marcat prezent la sesiune"

      // Refresh data
      await fetchStudents();
      setSelectedStudents(new Set());
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('Eroare la salvarea prezenței');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="outline">Nemarcată</Badge>;

    const variants = {
      PRESENT: 'bg-green-100 text-green-800',
      ABSENT: 'bg-red-100 text-red-800',
      LATE: 'bg-amber-100 text-amber-800',
      EXCUSED: 'bg-blue-100 text-blue-800',
    };

    const labels = {
      PRESENT: 'Prezent',
      ABSENT: 'Absent',
      LATE: 'Întârziat',
      EXCUSED: 'Scutit',
    };

    return (
      <Badge className={variants[status as keyof typeof variants]} variant="outline">
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Prezență Manuală
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkMarkPresent}
              disabled={selectedStudents.size === 0}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Marchează Prezent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkMarkAbsent}
              disabled={selectedStudents.size === 0}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Marchează Absent
            </Button>
            <Button onClick={handleSaveAttendance} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Se salvează...' : 'Salvează'}
            </Button>
          </div>
        </div>
        {selectedStudents.size > 0 && (
          <p className="text-sm text-muted-foreground">
            {selectedStudents.size} student(i) selectat(i)
          </p>
        )}
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Se încarcă...</div>
        ) : students.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Niciun student înscris la această activitate
          </div>
        ) : (
          <div className="space-y-3">
            {students.map((student) => {
              const state = attendanceState[student.id];
              const isSelected = selectedStudents.has(student.id);

              return (
                <div key={student.id} className="p-4 rounded-lg border bg-card space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        handleSelectStudent(student.id, checked as boolean)
                      }
                    />

                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(student.profiles.first_name, student.profiles.last_name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <p className="font-medium">
                        {student.profiles.first_name} {student.profiles.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{student.profiles.email}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Select
                        value={state?.status || 'none'}
                        onValueChange={(value) =>
                          value !== 'none' && handleStatusChange(student.id, value)
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none" disabled>
                            Selectează
                          </SelectItem>
                          <SelectItem value="PRESENT">Prezent</SelectItem>
                          <SelectItem value="ABSENT">Absent</SelectItem>
                          <SelectItem value="LATE">Întârziat</SelectItem>
                          <SelectItem value="EXCUSED">Scutit</SelectItem>
                        </SelectContent>
                      </Select>

                      {getStatusBadge(state?.status || null)}

                      {student.attendance?.check_in_method && (
                        <Badge variant="outline" className="bg-purple-100 text-purple-800">
                          {student.attendance.check_in_method === 'QR_CODE'
                            ? 'QR'
                            : student.attendance.check_in_method}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="pl-14 space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Note</label>
                    <Textarea
                      placeholder="Adaugă note despre student (opțional)..."
                      value={state?.notes || ''}
                      onChange={(e) => handleNotesChange(student.id, e.target.value)}
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
