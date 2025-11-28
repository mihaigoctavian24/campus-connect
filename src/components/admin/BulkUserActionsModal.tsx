'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Users,
  UserCog,
  Mail,
  Trash2,
  AlertTriangle,
  Loader2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'STUDENT' | 'PROFESSOR' | 'ADMIN';
  created_at: string;
  last_login: string | null;
  profile_picture_url: string | null;
  faculty: string | null;
  year: number | null;
  specialization: string | null;
  is_active: boolean | null;
}

type BulkAction = 'change_role' | 'send_email' | 'deactivate';

interface BulkUserActionsModalProps {
  users: User[];
  isOpen: boolean;
  onClose: () => void;
  onActionComplete: () => void;
}

function getRoleBadge(role: string) {
  const normalizedRole = role?.toUpperCase();
  switch (normalizedRole) {
    case 'ADMIN':
      return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
    case 'PROFESSOR':
      return <Badge className="bg-blue-100 text-blue-800">Profesor</Badge>;
    case 'STUDENT':
      return <Badge className="bg-green-100 text-green-800">Student</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
}

export function BulkUserActionsModal({
  users,
  isOpen,
  onClose,
  onActionComplete,
}: BulkUserActionsModalProps) {
  const [selectedAction, setSelectedAction] = useState<BulkAction | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [results, setResults] = useState<{ success: number; failed: number } | null>(null);

  // Count admins in selection (for warnings)
  const adminCount = users.filter((u) => u.role?.toUpperCase() === 'ADMIN').length;
  const hasAdmins = adminCount > 0;

  const handleExecuteAction = async () => {
    if (!selectedAction) return;

    setIsLoading(true);
    setResults(null);

    try {
      const response = await fetch('/api/admin/users/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: selectedAction,
          user_ids: users.map((u) => u.id),
          ...(selectedAction === 'change_role' && { new_role: selectedRole }),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Eroare la executarea acțiunii');
      }

      const data = await response.json();
      setResults(data.results);

      if (data.results.failed === 0) {
        toast.success(
          `Acțiunea a fost executată cu succes pentru ${data.results.success} utilizatori`
        );
        setTimeout(() => {
          onActionComplete();
        }, 1500);
      } else {
        toast.warning(
          `Acțiune parțial executată: ${data.results.success} reușite, ${data.results.failed} eșuate`
        );
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Eroare la executarea acțiunii');
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(false);
    }
  };

  const handleActionClick = () => {
    if (selectedAction === 'change_role' || selectedAction === 'deactivate') {
      setShowConfirmDialog(true);
    } else if (selectedAction === 'send_email') {
      // For email, open mailto with all emails
      const emails = users.map((u) => u.email).join(',');
      window.location.href = `mailto:${emails}`;
      onClose();
    }
  };

  const getActionDescription = () => {
    switch (selectedAction) {
      case 'change_role':
        return `Schimbă rolul la "${selectedRole === 'student' ? 'Student' : selectedRole === 'professor' ? 'Profesor' : 'Admin'}" pentru ${users.length} utilizatori`;
      case 'send_email':
        return `Trimite email către ${users.length} utilizatori`;
      case 'deactivate':
        return `Dezactivează ${users.length} conturi de utilizator`;
      default:
        return '';
    }
  };

  const resetState = () => {
    setSelectedAction(null);
    setSelectedRole('student');
    setResults(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  if (users.length === 0) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Acțiuni în masă
            </DialogTitle>
            <DialogDescription>
              Selectează o acțiune pentru {users.length} utilizator
              {users.length !== 1 ? 'i' : ''}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Selected Users Summary */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Utilizatori selectați</Label>
              <ScrollArea className="h-[120px] rounded-md border p-2">
                <div className="space-y-2">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between text-sm">
                      <span>
                        {user.first_name || user.last_name
                          ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                          : user.email}
                      </span>
                      {getRoleBadge(user.role)}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <Separator />

            {/* Action Selection */}
            <div className="space-y-3">
              <Label>Selectează acțiunea</Label>
              <RadioGroup
                value={selectedAction || ''}
                onValueChange={(value) => setSelectedAction(value as BulkAction)}
              >
                <div className="flex items-start space-x-3 p-3 rounded-md border hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="change_role" id="change_role" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="change_role" className="font-medium cursor-pointer">
                      <UserCog className="h-4 w-4 inline mr-2" />
                      Schimbă rolul
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Actualizează rolul pentru toți utilizatorii selectați
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-md border hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="send_email" id="send_email" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="send_email" className="font-medium cursor-pointer">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Trimite email
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Deschide clientul de email cu toți destinatarii
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-md border border-red-200 hover:bg-red-50/50 cursor-pointer">
                  <RadioGroupItem value="deactivate" id="deactivate" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="deactivate" className="font-medium cursor-pointer text-red-600">
                      <Trash2 className="h-4 w-4 inline mr-2" />
                      Dezactivează conturi
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Dezactivează conturile utilizatorilor selectați
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Role Selection (only for change_role action) */}
            {selectedAction === 'change_role' && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Label>Noul rol</Label>
                  <RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="role_student" />
                      <Label htmlFor="role_student" className="cursor-pointer">
                        <Badge className="bg-green-100 text-green-800">Student</Badge>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="professor" id="role_professor" />
                      <Label htmlFor="role_professor" className="cursor-pointer">
                        <Badge className="bg-blue-100 text-blue-800">Profesor</Badge>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="admin" id="role_admin" />
                      <Label htmlFor="role_admin" className="cursor-pointer">
                        <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            {/* Warning for admins */}
            {hasAdmins && selectedAction && selectedAction !== 'send_email' && (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">Atenție</p>
                    <p>
                      Selecția include {adminCount} administrator
                      {adminCount !== 1 ? 'i' : ''}. Modificarea rolurilor administratorilor poate
                      afecta securitatea sistemului.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {results && (
              <div className="rounded-md border p-3 space-y-2">
                <p className="font-medium">Rezultate</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    {results.success} reușite
                  </span>
                  {results.failed > 0 && (
                    <span className="flex items-center gap-1 text-red-600">
                      <XCircle className="h-4 w-4" />
                      {results.failed} eșuate
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Anulează
            </Button>
            <Button
              onClick={handleActionClick}
              disabled={!selectedAction || isLoading}
              variant={selectedAction === 'deactivate' ? 'destructive' : 'default'}
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Execută acțiunea
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirmare acțiune
            </AlertDialogTitle>
            <AlertDialogDescription>{getActionDescription()}</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Această acțiune va afecta {users.length} utilizator
              {users.length !== 1 ? 'i' : ''}.{' '}
              {selectedAction === 'deactivate' &&
                'Conturile dezactivate nu vor mai putea accesa platforma.'}
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Anulează</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleExecuteAction}
              disabled={isLoading}
              className={selectedAction === 'deactivate' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirmă
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
