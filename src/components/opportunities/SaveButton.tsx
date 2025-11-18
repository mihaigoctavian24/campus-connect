'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

interface SaveButtonProps {
  activityId: string;
  initialSaved?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
}

export function SaveButton({
  activityId,
  initialSaved = false,
  size = 'md',
  variant = 'icon'
}: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if button is inside a link
    e.stopPropagation(); // Prevent event bubbling

    setIsLoading(true);

    try {
      if (isSaved) {
        // Unsave
        const response = await fetch(`/api/users/me/saved/${activityId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to unsave opportunity');
        }

        setIsSaved(false);
      } else {
        // Save
        const response = await fetch('/api/users/me/saved', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ activityId }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to save opportunity');
        }

        setIsSaved(true);
      }
    } catch (error) {
      console.error('Save/unsave error:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'A apărut o eroare. Te rugăm să încerci din nou.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-6',
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  if (variant === 'button') {
    return (
      <button
        onClick={handleToggleSave}
        disabled={isLoading}
        className={`${buttonSizeClasses[size]} rounded-lg border border-gray-300 bg-white transition hover:bg-gray-50 hover:border-[#FFD600] disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label={isSaved ? 'Unsave opportunity' : 'Save opportunity'}
        title={isSaved ? 'Elimină din salvate' : 'Salvează pentru mai târziu'}
      >
        <Heart
          className={`${sizeClasses[size]} ${
            isSaved ? 'fill-[#FFD600] text-[#FFD600]' : 'text-gray-400'
          } transition-colors`}
        />
      </button>
    );
  }

  // Icon variant (default)
  return (
    <button
      onClick={handleToggleSave}
      disabled={isLoading}
      className="group rounded-full p-1.5 transition hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={isSaved ? 'Unsave opportunity' : 'Save opportunity'}
      title={isSaved ? 'Elimină din salvate' : 'Salvează pentru mai târziu'}
    >
      <Heart
        className={`${sizeClasses[size]} ${
          isSaved
            ? 'fill-[#FFD600] text-[#FFD600]'
            : 'text-gray-400 group-hover:text-[#FFD600]'
        } transition-colors`}
      />
    </button>
  );
}
