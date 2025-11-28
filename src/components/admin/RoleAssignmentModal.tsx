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
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, User, GraduationCap, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface UserData {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'STUDENT' | 'PROFESSOR' | 'ADMIN';
}

interface RoleAssignmentModalProps {
  user: UserData | null;
  isOpen: boolean;
  onClose: () => void;
  onRoleChanged: () => void;
}

const ROLES = [
  {
    value: 'STUDENT',
    label: 'Student',
    description: 'Poate vedea și aplica la oportunități de voluntariat',
    icon: User,
    color: 'bg-green-100 text-green-800',
  },
  {
    value: 'PROFESSOR',
    label: 'Profesor',
    description: 'Poate crea activități și valida ore de voluntariat',
    icon: GraduationCap,
    color: 'bg-blue-100 text-blue-800',
  },
  {
    value: 'ADMIN',
    label: 'Administrator',
    description: 'Acces complet la toate funcționalitățile platformei',
    icon: Shield,
    color: 'bg-purple-100 text-purple-800',
  },
];

export function RoleAssignmentModal({
  user,
  isOpen,
  onClose,
  onRoleChanged,
}: RoleAssignmentModalProps) {
  const [selectedRole, setSelectedRole] = useState<string>(user?.role || 'student');
  const [isLoading, setIsLoading] = useState(false);

  // Reset selected role when user changes
  if (user && selectedRole !== user.role && !isLoading) {
    setSelectedRole(user.role);
  }

  const handleSubmit = async () => {
    if (!user || selectedRole === user.role) {
      onClose();
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`/api/admin/users/${user.id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Eroare la actualizarea rolului');
      }

      onRoleChanged();
      onClose();
    } catch (err) {
      console.error('Error changing role:', err);
      toast.error(err instanceof Error ? err.message : 'Eroare la actualizarea rolului');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  const fullName =
    user.first_name || user.last_name
      ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
      : user.email;

  const isChangingToAdmin = selectedRole === 'ADMIN' && user.role?.toUpperCase() !== 'ADMIN';
  const isRemovingAdmin = user.role?.toUpperCase() === 'ADMIN' && selectedRole !== 'ADMIN';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schimbă Rol</DialogTitle>
          <DialogDescription>
            Modifică rolul utilizatorului <strong>{fullName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Role */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-muted-foreground">Rol curent:</span>
            <Badge className={ROLES.find((r) => r.value === user.role)?.color}>
              {ROLES.find((r) => r.value === user.role)?.label}
            </Badge>
          </div>

          {/* Role Selection */}
          <RadioGroup value={selectedRole} onValueChange={setSelectedRole} className="space-y-3">
            {ROLES.map((role) => {
              const Icon = role.icon;
              const isCurrentRole = role.value === user.role;

              return (
                <div key={role.value}>
                  <Label
                    htmlFor={role.value}
                    className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedRole === role.value
                        ? 'border-[#001f3f] bg-[#001f3f]/5'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <RadioGroupItem value={role.value} id={role.value} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{role.label}</span>
                        {isCurrentRole && (
                          <Badge variant="outline" className="text-xs">
                            Actual
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                    </div>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>

          {/* Warnings */}
          {isChangingToAdmin && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Atenție:</strong> Acordarea rolului de Administrator oferă acces complet la
                platformă, inclusiv gestionarea altor utilizatori.
              </AlertDescription>
            </Alert>
          )}

          {isRemovingAdmin && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Atenție:</strong> Acest utilizator va pierde accesul la funcționalitățile de
                administrare.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Anulează
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || selectedRole === user.role}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Se salvează...
              </>
            ) : (
              'Salvează'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
