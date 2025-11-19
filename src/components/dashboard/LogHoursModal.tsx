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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Clock, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/components/ui/utils';

interface LogHoursModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activities?: Array<{
    id: string;
    title: string;
  }>;
}

export function LogHoursModal({ open, onOpenChange, activities = [] }: LogHoursModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // TODO: Implement actual API call to log hours
      // Hours data: activityId, date, hours, description

      // Reset form
      setDate(new Date());
      setSelectedActivity('');
      setHours('');
      setDescription('');
      setSubmitting(false);
      onOpenChange(false);

      // TODO: Show success toast
      alert('Hours submitted successfully! Waiting for professor approval.');
    }, 1000);
  };

  const isValid = selectedActivity && hours && parseFloat(hours) > 0 && description;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Log Volunteer Hours</DialogTitle>
          <DialogDescription>
            Record hours for activities outside of scheduled sessions. These will need professor
            approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Activity Selection */}
          <div className="space-y-2">
            <Label htmlFor="activity">Activity *</Label>
            <Select value={selectedActivity} onValueChange={setSelectedActivity}>
              <SelectTrigger id="activity">
                <SelectValue placeholder="Select an activity" />
              </SelectTrigger>
              <SelectContent>
                {activities.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No active activities
                  </SelectItem>
                ) : (
                  activities.map((activity) => (
                    <SelectItem key={activity.id} value={activity.id}>
                      {activity.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Hours Input */}
          <div className="space-y-2">
            <Label htmlFor="hours">Hours Worked *</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="hours"
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                placeholder="2.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter hours in decimal format (e.g., 2.5)
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="description"
                placeholder="Describe what you worked on (e.g., Prepared materials for next session, researched study techniques...)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="pl-10 min-h-[100px]"
                maxLength={500}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {description.length}/500 characters
            </p>
          </div>

          {/* Warning Message */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-800">
              These hours will be marked as <strong>Pending</strong> until approved by your activity
              coordinator.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || submitting}>
              {submitting ? 'Submitting...' : 'Submit for Approval'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
