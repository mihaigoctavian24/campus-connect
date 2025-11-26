'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle, XCircle, Save, FileText } from 'lucide-react';

interface Application {
  id: string;
  user_id: string;
  status: string;
  motivation: string;
  availability: string;
  experience: string;
  applied_at: string;
  professor_notes?: string | null;
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
  activityId: string;
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
  onNotesUpdate?: () => void;
}

export function ApplicationDetailView({
  application,
  activityId,
  isOpen,
  onClose,
  onAccept,
  onReject,
  onNotesUpdate,
}: ApplicationDetailViewProps) {
  const { student } = application;
  const [professorNotes, setProfessorNotes] = useState(application.professor_notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);
  const [notesSuccess, setNotesSuccess] = useState(false);

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    setNotesError(null);
    setNotesSuccess(false);

    try {
      const response = await fetch(
        `/api/activities/${activityId}/enrollments/${application.id}/notes`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ professor_notes: professorNotes }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save notes');
      }

      setNotesSuccess(true);
      if (onNotesUpdate) {
        onNotesUpdate();
      }
      setTimeout(() => setNotesSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving professor notes:', error);
      setNotesError('Eroare la salvarea notițelor');
    } finally {
      setIsSavingNotes(false);
    }
  };

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

          {/* Professor Notes Section */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-[#001f3f]" />
              <h4 className="text-sm font-medium text-[#001f3f]">Notițe Professor (Private)</h4>
            </div>
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="space-y-3">
                <Textarea
                  value={professorNotes}
                  onChange={(e) => setProfessorNotes(e.target.value)}
                  placeholder="Adaugă notițe despre acest student (vizibile doar pentru tine)..."
                  className="min-h-[100px] resize-none bg-white"
                  disabled={isSavingNotes}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Aceste notițe sunt private și nu vor fi văzute de student
                  </p>
                  <div className="flex items-center gap-2">
                    {notesSuccess && (
                      <span className="text-xs text-green-600 font-medium">✓ Salvat</span>
                    )}
                    {notesError && <span className="text-xs text-red-600">{notesError}</span>}
                    <Button
                      onClick={handleSaveNotes}
                      disabled={isSavingNotes}
                      size="sm"
                      className="bg-[#001f3f] hover:bg-[#001f3f]/90 gap-2"
                    >
                      {isSavingNotes ? (
                        <>Salvează...</>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Salvează Notițe
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
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
