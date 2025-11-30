'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

interface OpportunityImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  disabled?: boolean;
}

export function OpportunityImageUpload({
  value,
  onChange,
  disabled = false,
}: OpportunityImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return 'Formatul fișierului nu este suportat. Folosește JPG, PNG, WebP sau GIF.';
    }
    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return 'Imaginea trebuie să fie mai mică de 5MB.';
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError('Trebuie să fii autentificat pentru a încărca imagini.');
        return;
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('activity-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        setError('Eroare la încărcarea imaginii. Te rugăm să încerci din nou.');
        return;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('activity-images').getPublicUrl(data.path);

      onChange(publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError('A apărut o eroare neașteptată.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled || isUploading) return;

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        uploadFile(files[0]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disabled, isUploading]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled || isUploading) return;

    const files = e.target.files;
    if (files && files[0]) {
      uploadFile(files[0]);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">Imagine de copertă (opțional)</label>

      {value ? (
        // Preview uploaded image
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute right-2 top-2"
            onClick={handleRemove}
            disabled={disabled || isUploading}
          >
            <X className="mr-1 h-4 w-4" />
            Șterge
          </Button>
        </div>
      ) : (
        // Upload area
        <div
          className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
            dragActive ? 'border-[#001f3f] bg-[#001f3f]/5' : 'border-gray-300 hover:border-gray-400'
          } ${disabled || isUploading ? 'cursor-not-allowed opacity-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && !isUploading && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleChange}
            className="hidden"
            disabled={disabled || isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-10 w-10 animate-spin text-[#001f3f]" />
              <span className="text-sm text-gray-500">Se încarcă...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 p-6 text-center">
              <div className="rounded-full bg-gray-100 p-3">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  <span className="text-[#001f3f]">Click pentru a încărca</span> sau drag & drop
                </p>
                <p className="mt-1 text-xs text-gray-500">PNG, JPG, WebP sau GIF (max. 5MB)</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
              >
                <Upload className="mr-2 h-4 w-4" />
                Selectează imagine
              </Button>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-gray-500">
        Imaginea va apărea pe card-ul oportunității și pe pagina de detalii. Recomandăm dimensiunea
        de 1200x630 pixeli pentru rezultate optime.
      </p>
    </div>
  );
}
