'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Mail, User, Clock, TrendingDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';

interface AtRiskStudent {
  id: string;
  name: string;
  email: string;
  attendanceRate: number;
  missedSessions: number;
  lastActivity: string | null;
  activityTitle: string;
  trend: 'declining' | 'stable' | 'improving';
}

interface AtRiskStudentAlertProps {
  students: AtRiskStudent[];
  title?: string;
  description?: string;
  threshold?: number;
  maxDisplay?: number;
  onContactStudent?: (student: AtRiskStudent) => void;
}

function getTrendIcon(trend: AtRiskStudent['trend']) {
  switch (trend) {
    case 'declining':
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    case 'improving':
      return <TrendingDown className="h-4 w-4 text-green-500 rotate-180" />;
    default:
      return null;
  }
}

function getTrendLabel(trend: AtRiskStudent['trend']) {
  switch (trend) {
    case 'declining':
      return 'În scădere';
    case 'improving':
      return 'În creștere';
    default:
      return 'Stabil';
  }
}

export function AtRiskStudentAlert({
  students,
  title = 'Studenți la Risc',
  description = 'Studenți cu prezență scăzută care necesită atenție',
  threshold = 40,
  maxDisplay = 5,
  onContactStudent,
}: AtRiskStudentAlertProps) {
  // Filter students below threshold
  const atRiskStudents = students
    .filter((s) => s.attendanceRate < threshold)
    .sort((a, b) => a.attendanceRate - b.attendanceRate)
    .slice(0, maxDisplay);

  if (atRiskStudents.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <AlertTriangle className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription className="text-green-600">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-green-600 font-medium">
              Excelent! Toți studenții au o prezență bună.
            </p>
            <p className="text-sm text-green-500 mt-1">
              Niciun student nu are prezența sub {threshold}%
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription className="text-amber-600">{description}</CardDescription>
          </div>
          <Badge variant="outline" className="border-amber-300 text-amber-700">
            {atRiskStudents.length} studenți
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[350px]">
          <div className="space-y-3">
            {atRiskStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-amber-100">
                    <User className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.activityTitle}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span
                          className={`font-medium ${
                            student.attendanceRate < 20 ? 'text-red-600' : 'text-amber-600'
                          }`}
                        >
                          {student.attendanceRate}% prezență
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        {getTrendIcon(student.trend)}
                        {getTrendLabel(student.trend)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {student.missedSessions} sesiuni ratate
                      </span>
                      {student.lastActivity && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(student.lastActivity), {
                            addSuffix: true,
                            locale: ro,
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {onContactStudent ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onContactStudent(student)}
                      className="border-amber-300 text-amber-700 hover:bg-amber-100"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Link href={`mailto:${student.email}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-amber-300 text-amber-700 hover:bg-amber-100"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {students.filter((s) => s.attendanceRate < threshold).length > maxDisplay && (
          <Link href="/dashboard/professor/students?filter=at-risk">
            <Button variant="ghost" className="w-full mt-4 text-amber-700 hover:bg-amber-100">
              Vezi toți studenții la risc
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
