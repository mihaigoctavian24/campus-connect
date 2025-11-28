'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, Award } from 'lucide-react';

interface ProgressGoalBarProps {
  currentHours: number;
  goalHours: number;
  title?: string;
  description?: string;
  semesterName?: string;
}

export function ProgressGoalBar({
  currentHours,
  goalHours,
  title = 'Progres semestru',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  description:
    _description = 'Urmărește-ți obiectivul de ore de voluntariat pentru semestrul curent',
  semesterName = 'Semestrul curent',
}: ProgressGoalBarProps) {
  const percentage = useMemo(() => {
    if (goalHours <= 0) return 0;
    return Math.min(100, Math.round((currentHours / goalHours) * 100));
  }, [currentHours, goalHours]);

  const remainingHours = useMemo(() => {
    return Math.max(0, goalHours - currentHours);
  }, [currentHours, goalHours]);

  const isCompleted = percentage >= 100;
  const isNearCompletion = percentage >= 75 && percentage < 100;

  const getStatusColor = () => {
    if (isCompleted) return 'text-green-600';
    if (isNearCompletion) return 'text-amber-600';
    return 'text-[#001f3f]';
  };

  /* Unused but kept for future use
  const getProgressColor = () => {
    if (isCompleted) return 'bg-green-500';
    if (isNearCompletion) return 'bg-amber-500';
    return 'bg-[#001f3f]';
  };
  */

  const getMessage = () => {
    if (isCompleted) {
      const extraHours = currentHours - goalHours;
      return extraHours > 0
        ? `Felicitări! Ai depășit obiectivul cu ${extraHours}h!`
        : 'Felicitări! Ai atins obiectivul!';
    }
    if (isNearCompletion) {
      return `Mai ai nevoie de doar ${remainingHours}h pentru a atinge obiectivul!`;
    }
    if (percentage >= 50) {
      return `Ești pe drumul cel bun! Mai ai ${remainingHours}h până la obiectiv.`;
    }
    return `Continuă să participi! Ai acumulat ${currentHours}h din ${goalHours}h.`;
  };

  return (
    <Card className={isCompleted ? 'border-green-200 bg-green-50/50' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <Award className="h-5 w-5 text-green-600" />
            ) : isNearCompletion ? (
              <TrendingUp className="h-5 w-5 text-amber-600" />
            ) : (
              <Target className="h-5 w-5 text-[#001f3f]" />
            )}
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{semesterName}</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-bold ${getStatusColor()}`}>{percentage}%</p>
            <p className="text-sm text-muted-foreground">
              {currentHours}h / {goalHours}h
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Progress
            value={percentage}
            className="h-4"
            // Custom styling via CSS class
          />
          <style jsx global>{`
            .progress-indicator {
              background-color: ${isCompleted
                ? '#22c55e'
                : isNearCompletion
                  ? '#f59e0b'
                  : '#001f3f'};
            }
          `}</style>
        </div>

        <div className="flex items-center justify-between text-sm">
          <p className={`font-medium ${getStatusColor()}`}>{getMessage()}</p>
          {!isCompleted && <p className="text-muted-foreground">{remainingHours}h rămase</p>}
        </div>

        {/* Milestone markers */}
        <div className="relative pt-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0h</span>
            <span className={percentage >= 25 ? 'text-[#001f3f] font-medium' : ''}>
              {Math.round(goalHours * 0.25)}h
            </span>
            <span className={percentage >= 50 ? 'text-[#001f3f] font-medium' : ''}>
              {Math.round(goalHours * 0.5)}h
            </span>
            <span className={percentage >= 75 ? 'text-amber-600 font-medium' : ''}>
              {Math.round(goalHours * 0.75)}h
            </span>
            <span className={isCompleted ? 'text-green-600 font-medium' : ''}>{goalHours}h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
