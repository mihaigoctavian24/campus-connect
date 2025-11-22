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
import { CheckCircle, XCircle } from 'lucide-react';

interface Application {
  id: string;
  user_id: string;
  status: string;
  motivation: string;
  availability: string;
  experience: string;
  applied_at: string;
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

interface ApplicationDetailViewProps {
  application: Application;
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
}

export function ApplicationDetailView({
  application,
  isOpen,
  onClose,
  onAccept,
  onReject,
}: ApplicationDetailViewProps) {
  const { student } = application;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalii Aplicație</DialogTitle>
          <DialogDescription>
            Profilul complet al studentului și răspunsurile la aplicație
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Student Info Card */}
          <Card className="p-4 bg-muted">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl flex-shrink-0">
                {student.first_name[0]}
                {student.last_name[0]}
              </div>
              <div className="flex-1">
                <h4 className="text-primary mb-1 font-semibold">
                  {student.first_name} {student.last_name}
                </h4>
                <p className="text-sm text-muted-foreground mb-2">{student.email}</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge>Anul {student.year}</Badge>
                  <Badge variant="outline">{student.program_type}</Badge>
                  <Badge variant="outline">{student.specialization}</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Statistics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 text-center">
              <p className="text-sm text-muted-foreground mb-1">Facultate</p>
              <p className="text-sm font-medium truncate">{student.faculty || 'N/A'}</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-sm text-muted-foreground mb-1">Activități</p>
              <p className="text-2xl text-primary font-bold">{student.completed_activities}</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-sm text-muted-foreground mb-1">Certificate</p>
              <p className="text-2xl text-primary font-bold">{student.certificates_earned}</p>
            </Card>
          </div>

          {/* Application Responses */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Motivație</h4>
              <Card className="p-3">
                <p className="text-sm whitespace-pre-wrap">{application.motivation}</p>
              </Card>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Disponibilitate</h4>
              <Card className="p-3">
                <p className="text-sm whitespace-pre-wrap">{application.availability}</p>
              </Card>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Experiență Relevantă
              </h4>
              <Card className="p-3">
                <p className="text-sm whitespace-pre-wrap">{application.experience}</p>
              </Card>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Data Aplicării</h4>
              <Card className="p-3">
                <p className="text-sm">
                  {new Date(application.applied_at).toLocaleDateString('ro-RO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </Card>
            </div>
          </div>

          {/* Actions */}
          {application.status === 'PENDING' && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Închide
              </Button>
              <Button
                onClick={() => {
                  onReject();
                  onClose();
                }}
                variant="outline"
                className="text-destructive hover:text-destructive gap-2"
              >
                <XCircle className="h-4 w-4" />
                Respinge
              </Button>
              <Button
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className="bg-green-600 hover:bg-green-700 gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Acceptă
              </Button>
            </div>
          )}
          {application.status !== 'PENDING' && (
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={onClose}>Închide</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
