'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { User, Mail, Calendar, GraduationCap, Building, Clock, Shield } from 'lucide-react';
import Image from 'next/image';

interface UserData {
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

interface UserDetailModalProps {
  user: UserData | null;
  isOpen: boolean;
  onClose: () => void;
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

function getRoleLabel(role: string) {
  const normalizedRole = role?.toUpperCase();
  switch (normalizedRole) {
    case 'ADMIN':
      return 'Administrator';
    case 'PROFESSOR':
      return 'Profesor';
    case 'STUDENT':
      return 'Student';
    default:
      return role;
  }
}

export function UserDetailModal({ user, isOpen, onClose }: UserDetailModalProps) {
  if (!user) return null;

  const fullName =
    user.first_name || user.last_name
      ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
      : 'Necompletat';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalii Utilizator</DialogTitle>
          <DialogDescription>Informații complete despre utilizator</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative">
              {user.profile_picture_url ? (
                <Image
                  src={user.profile_picture_url}
                  alt={fullName}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-gray-500" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{fullName}</h3>
              <div className="flex items-center gap-2 mt-1">{getRoleBadge(user.role)}</div>
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Informații de contact</h4>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.email}</span>
            </div>
          </div>

          <Separator />

          {/* Academic Info (for students) */}
          {user.role?.toUpperCase() === 'STUDENT' && (
            <>
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Informații academice</h4>
                {user.faculty && (
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.faculty}</span>
                  </div>
                )}
                {user.year && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Anul {user.year}</span>
                  </div>
                )}
                {user.specialization && (
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.specialization}</span>
                  </div>
                )}
                {!user.faculty && !user.year && (
                  <p className="text-sm text-muted-foreground italic">
                    Nu au fost completate informațiile academice
                  </p>
                )}
              </div>
              <Separator />
            </>
          )}

          {/* Department Info (for professors) */}
          {user.role?.toUpperCase() === 'PROFESSOR' && (
            <>
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Informații profesor</h4>
                {user.faculty ? (
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.faculty}</span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Nu au fost completate informațiile
                  </p>
                )}
              </div>
              <Separator />
            </>
          )}

          {/* Account Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Informații cont</h4>
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Rol: {getRoleLabel(user.role)}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Înregistrat: {format(new Date(user.created_at), 'd MMMM yyyy', { locale: ro })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Ultima activitate:{' '}
                {user.last_login
                  ? format(new Date(user.last_login), 'd MMMM yyyy, HH:mm', { locale: ro })
                  : 'Niciodată'}
              </span>
            </div>
          </div>

          {/* User ID */}
          <div className="pt-2">
            <p className="text-xs text-muted-foreground">ID: {user.id}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
