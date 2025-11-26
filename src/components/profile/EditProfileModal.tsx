'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProfileEditForm } from './ProfileEditForm';
import { AvatarUpload } from './AvatarUpload';

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    faculty: string | null;
    specialization: string | null;
    year: number | null;
    program_type: string | null;
    role: string;
    full_name: string | null;
    email: string;
    profile_picture_url: string | null;
  };
  onSave: (data: any) => Promise<void>;
  onUploadAvatar: (file: File) => Promise<string>;
  onRemoveAvatar: () => Promise<void>;
}

export function EditProfileModal({
  open,
  onOpenChange,
  profile,
  onSave,
  onUploadAvatar,
  onRemoveAvatar,
}: EditProfileModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#001f3f]">
            Editare Profil
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar Upload Section */}
          <div className="pb-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-[#001f3f] mb-4">Poză de Profil</h3>
            <AvatarUpload
              currentAvatarUrl={profile.profile_picture_url}
              onUpload={onUploadAvatar}
              onRemove={profile.profile_picture_url ? onRemoveAvatar : undefined}
              userName={profile.full_name || profile.email}
            />
          </div>

          {/* Profile Edit Form */}
          <ProfileEditForm
            profile={{
              first_name: profile.first_name,
              last_name: profile.last_name,
              phone: profile.phone,
              faculty: profile.faculty,
              specialization: profile.specialization,
              year: profile.year,
              program_type: profile.program_type,
              role: profile.role,
            }}
            onSave={async (data) => {
              await onSave(data);
              onOpenChange(false); // Close modal on success
            }}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
