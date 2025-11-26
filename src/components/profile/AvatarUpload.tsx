'use client';

import { useState, useRef } from 'react';
import { User, Upload, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface AvatarUploadProps {
  currentAvatarUrl: string | null;
  onUpload: (file: File) => Promise<string>;
  onRemove?: () => Promise<void>;
  userName: string;
}

export function AvatarUpload({
  currentAvatarUrl,
  onUpload,
  onRemove,
  userName,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Te rugăm să selectezi o imagine validă');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Imaginea nu poate depăși 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload to Supabase Storage
      const newAvatarUrl = await onUpload(file);
      setPreviewUrl(newAvatarUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea imaginii');
      setPreviewUrl(currentAvatarUrl);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!onRemove) return;

    try {
      setIsUploading(true);
      setError(null);
      await onRemove();
      setPreviewUrl(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la ștergerea imaginii');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Display */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-[#001f3f] flex items-center justify-center border-4 border-white shadow-lg">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={userName}
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          ) : (
            <User className="w-16 h-16 text-white" />
          )}
        </div>

        {/* Loading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        {/* Remove Button */}
        {previewUrl && onRemove && !isUploading && (
          <button
            onClick={handleRemoveAvatar}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-md"
            title="Șterge fotografia"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-xs bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm text-center">
          {error}
        </div>
      )}

      {/* Upload Button */}
      <div className="flex flex-col items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={triggerFileSelect}
          disabled={isUploading}
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          {previewUrl ? 'Schimbă fotografia' : 'Încarcă fotografie'}
        </Button>
        <p className="text-xs text-gray-500 text-center">
          Formaturi acceptate: JPG, PNG, GIF
          <br />
          Dimensiune maximă: 5MB
        </p>
      </div>
    </div>
  );
}
