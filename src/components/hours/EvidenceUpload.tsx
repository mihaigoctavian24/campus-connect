'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, File, Image as ImageIcon, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface EvidenceUploadProps {
  onUploadComplete: (urls: string[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

interface UploadedFile {
  name: string;
  url: string;
  type: string;
  size: number;
}

export function EvidenceUpload({
  onUploadComplete,
  maxFiles = 5,
  maxSizeMB = 5,
}: EvidenceUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const supabase = createClient();

  const validateFile = (file: File): string | null => {
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      return `Fișierul ${file.name} depășește ${maxSizeMB}MB`;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return `Tipul fișierului ${file.name} nu este permis (doar imagini și PDF)`;
    }

    return null;
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `hours-evidence/${fileName}`;

    const { data, error } = await supabase.storage.from('hours-evidence').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      throw new Error(`Eroare la upload: ${error.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('hours-evidence').getPublicUrl(data.path);

    return publicUrl;
  };

  const handleFiles = useCallback(
    async (fileList: FileList) => {
      if (files.length >= maxFiles) {
        toast.error(`Maxim ${maxFiles} fișiere permise`);
        return;
      }

      const filesToUpload = Array.from(fileList).slice(0, maxFiles - files.length);

      // Validate all files first
      for (const file of filesToUpload) {
        const error = validateFile(file);
        if (error) {
          toast.error(error);
          return;
        }
      }

      setIsUploading(true);

      try {
        const uploadedUrls: string[] = [];
        const uploadedFiles: UploadedFile[] = [];

        for (const file of filesToUpload) {
          const url = await uploadFile(file);
          uploadedUrls.push(url);
          uploadedFiles.push({
            name: file.name,
            url,
            type: file.type,
            size: file.size,
          });
        }

        const newFiles = [...files, ...uploadedFiles];
        setFiles(newFiles);
        onUploadComplete(newFiles.map((f) => f.url));
        toast.success(`${filesToUpload.length} fișier(e) încărcat(e) cu succes`);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(error instanceof Error ? error.message : 'Eroare la încărcarea fișierelor');
      } finally {
        setIsUploading(false);
      }
    },
    [files, maxFiles, onUploadComplete]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onUploadComplete(newFiles.map((f) => f.url));
    toast.success('Fișier eliminat');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className={`p-6 border-2 border-dashed transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
        } ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Se încarcă fișierele...</p>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground" />
              <div>
                <p className="font-medium">Click pentru a selecta fișiere</p>
                <p className="text-sm text-muted-foreground">sau trage și lasă fișierele aici</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Imagini sau PDF • Max {maxSizeMB}MB per fișier • Max {maxFiles} fișiere
              </p>
            </>
          )}
        </div>
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/jpg,application/pdf"
          onChange={handleFileInput}
          className="hidden"
          disabled={isUploading || files.length >= maxFiles}
        />
      </Card>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Fișiere încărcate ({files.length}/{maxFiles})
          </p>
          {files.map((file, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center gap-3">
                {/* File Icon */}
                {file.type.startsWith('image/') ? (
                  <ImageIcon className="h-8 w-8 text-blue-500 flex-shrink-0" />
                ) : (
                  <File className="h-8 w-8 text-red-500 flex-shrink-0" />
                )}

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
