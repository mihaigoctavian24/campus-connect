'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Clock } from 'lucide-react';
import { cn } from './utils';

interface TimePickerProps {
  value?: string; // Format: "HH:mm" (24-hour)
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  interval?: number; // Minutes interval (default: 15)
}

const generateMinutes = (interval: number = 15): number[] => {
  const minutes: number[] = [];
  for (let i = 0; i < 60; i += interval) {
    minutes.push(i);
  }
  return minutes;
};

export function TimePicker({
  value,
  onChange,
  className,
  placeholder = '--:--',
  disabled = false,
  interval = 15,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const inputRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const minutes = generateMinutes(interval);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Parse value prop
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':').map(Number);
      setHour(h || 0);
      setMinute(m || 0);
    }
  }, [value]);

  // Update position when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }

    return undefined;
  }, [isOpen]);

  // Handle hour change
  const handleHourChange = (newHour: number) => {
    setHour(newHour);
    const timeString = `${newHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    onChange?.(timeString);
  };

  // Handle minute change
  const handleMinuteChange = (newMinute: number) => {
    setMinute(newMinute);
    const timeString = `${hour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`;
    onChange?.(timeString);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const displayValue = value || placeholder;

  const dropdownContent = isOpen && mounted && (
    <div
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
      className="fixed z-[9999] rounded-lg border border-border bg-popover shadow-xl pointer-events-auto"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
      }}
    >
      <div className="p-4 space-y-4">
        {/* Hour Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Ora</label>
            <span className="text-sm font-bold text-primary">
              {hour.toString().padStart(2, '0')}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="23"
            value={hour}
            onChange={(e) => handleHourChange(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary pointer-events-auto"
            style={{ pointerEvents: 'auto' }}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>00</span>
            <span>12</span>
            <span>23</span>
          </div>
        </div>

        {/* Minute Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Minute</label>
            <span className="text-sm font-bold text-primary">
              {minute.toString().padStart(2, '0')}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="45"
            step={interval}
            value={minute}
            onChange={(e) => handleMinuteChange(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary pointer-events-auto"
            style={{ pointerEvents: 'auto' }}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            {minutes.map(
              (m, idx) =>
                idx % Math.ceil(minutes.length / 3) === 0 && (
                  <span key={m}>{m.toString().padStart(2, '0')}</span>
                )
            )}
          </div>
        </div>

        {/* Current Time Display */}
        <div className="pt-2 border-t border-border">
          <div className="text-center">
            <span className="text-2xl font-bold text-primary">
              {hour.toString().padStart(2, '0')}:{minute.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Input */}
      <div
        ref={inputRef}
        onClick={(e) => {
          e.stopPropagation();
          toggleDropdown();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className={cn(
          'flex h-9 w-full items-center rounded-md border border-input bg-input-background px-3 text-sm',
          'transition-colors cursor-pointer',
          'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className={cn('flex-1', !value && 'text-muted-foreground')}>{displayValue}</span>
        <svg
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.29635 5.15354L2.29632 5.15357L2.30055 5.1577L7.65055 10.3827L8.00157 10.7255L8.35095 10.381L13.701 5.10603L13.701 5.10604L13.7035 5.10354C13.722 5.08499 13.7385 5.08124 13.7499 5.08124C13.7613 5.08124 13.7778 5.08499 13.7963 5.10354C13.8149 5.12209 13.8187 5.13859 13.8187 5.14999C13.8187 5.1612 13.815 5.17734 13.7973 5.19552L8.04946 10.8433L8.04945 10.8433L8.04635 10.8464C8.01594 10.8768 7.99586 10.8921 7.98509 10.8992C7.97746 10.8983 7.97257 10.8968 7.96852 10.8952C7.96226 10.8929 7.94944 10.887 7.92872 10.8721L2.20253 5.2455C2.18478 5.22733 2.18115 5.2112 2.18115 5.19999C2.18115 5.18859 2.18491 5.17209 2.20346 5.15354C2.222 5.13499 2.2385 5.13124 2.2499 5.13124C2.2613 5.13124 2.2778 5.13499 2.29635 5.15354Z"
            fill="currentColor"
            stroke="currentColor"
          />
        </svg>
      </div>

      {/* Portal for dropdown */}
      {typeof window !== 'undefined' && createPortal(dropdownContent, document.body)}
    </>
  );
}
