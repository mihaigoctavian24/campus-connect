'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Award, Calendar, GraduationCap, Mail, User } from 'lucide-react';

interface Student {
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
}

interface StudentProfileQuickViewProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
}

export function StudentProfileQuickView({
  student,
  isOpen,
  onClose,
}: StudentProfileQuickViewProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Profil Student</DialogTitle>
          <DialogDescription>Informații academice și activități volunteer</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Student Header */}
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl flex-shrink-0 font-bold">
                {student.first_name[0]}
                {student.last_name[0]}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary mb-1">
                  {student.first_name} {student.last_name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Mail className="h-4 w-4" />
                  {student.email}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge className="bg-primary">Anul {student.year}</Badge>
                  <Badge variant="outline">{student.program_type}</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Academic Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Informații Academice
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3">
                <p className="text-xs text-muted-foreground mb-1">Facultate</p>
                <p className="text-sm font-medium truncate">
                  {student.faculty || 'Nu este specificat'}
                </p>
              </Card>
              <Card className="p-3">
                <p className="text-xs text-muted-foreground mb-1">Specializare</p>
                <p className="text-sm font-medium truncate">
                  {student.specialization || 'Nu este specificat'}
                </p>
              </Card>
            </div>
          </div>

          {/* Volunteer Activity Stats */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Activitate Volunteer
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 text-center bg-primary/5">
                <div className="flex items-center justify-center mb-2">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-primary mb-1">
                  {student.completed_activities}
                </p>
                <p className="text-xs text-muted-foreground">
                  Activități Completate
                </p>
              </Card>
              <Card className="p-4 text-center bg-secondary/5">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-5 w-5 text-secondary" />
                </div>
                <p className="text-2xl font-bold text-secondary mb-1">
                  {student.certificates_earned}
                </p>
                <p className="text-xs text-muted-foreground">Certificate Obținute</p>
              </Card>
            </div>
          </div>

          {/* Performance Indicators */}
          {student.completed_activities > 0 && (
            <Card className="p-4 bg-muted">
              <h4 className="text-sm font-semibold mb-3">Indicatori de Performanță</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Nivel Experiență:</span>
                  <Badge variant="outline">
                    {student.completed_activities < 3
                      ? 'Începător'
                      : student.completed_activities < 6
                        ? 'Intermediar'
                        : 'Avansat'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Rata Finalizare:</span>
                  <span className="font-medium">
                    {student.certificates_earned > 0
                      ? `${Math.round((student.certificates_earned / student.completed_activities) * 100)}%`
                      : 'N/A'}
                  </span>
                </div>
                {student.certificates_earned > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Certificate / Activitate:</span>
                    <span className="font-medium">
                      {(student.certificates_earned / student.completed_activities).toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {student.completed_activities === 0 && (
            <Card className="p-4 bg-muted text-center">
              <p className="text-sm text-muted-foreground">
                Acesta este prima aplicație a studentului pe platformă
              </p>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Închide</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
