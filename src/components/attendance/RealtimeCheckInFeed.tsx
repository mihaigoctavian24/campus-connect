'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Users, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

interface AttendanceRecord {
  id: string;
  user_id: string;
  enrollment_id: string;
  status: 'PRESENT' | 'ABSENT' | 'EXCUSED' | 'LATE';
  check_in_method: 'QR_CODE' | 'MANUAL' | 'GPS' | 'BULK';
  checked_in_at: string;
  checked_in_by: string | null;
  notes: string | null;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface RealtimeCheckInFeedProps {
  sessionId: string;
  activityId: string;
}

type FilterType = 'all' | 'checked-in' | 'not-checked-in';

export function RealtimeCheckInFeed({ sessionId, activityId }: RealtimeCheckInFeedProps) {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [checkedInCount, setCheckedInCount] = useState(0);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const supabase = createClient();

  // Fetch initial data
  const fetchAttendanceData = async () => {
    setIsLoading(true);
    try {
      // Get total enrolled students for this session
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select('id')
        .eq('activity_id', activityId)
        .eq('status', 'CONFIRMED');

      if (enrollError) throw enrollError;
      setEnrolledCount(enrollments?.length || 0);

      // Get attendance records for this session
      const { data: attendance, error: attendError } = await supabase
        .from('attendance')
        .select(
          `
          id,
          user_id,
          enrollment_id,
          status,
          check_in_method,
          checked_in_at,
          checked_in_by,
          notes,
          profiles!attendance_user_id_fkey (
            first_name,
            last_name,
            email
          )
        `
        )
        .eq('session_id', sessionId)
        .order('checked_in_at', { ascending: false });

      if (attendError) throw attendError;

      setAttendanceRecords((attendance as any[]) || []);
      setCheckedInCount(attendance?.filter((a: any) => a.status === 'PRESENT').length || 0);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Setup Supabase Realtime subscription
  useEffect(() => {
    fetchAttendanceData();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`session-${sessionId}-attendance`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'attendance',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload: any) => {
          console.log('Realtime attendance update:', payload);
          // Refresh data when changes occur
          fetchAttendanceData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, activityId]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAttendanceData();
    }, 30000);

    return () => clearInterval(interval);
  }, [sessionId, activityId]);

  // Filter records based on selected filter
  const filteredRecords = attendanceRecords.filter((record) => {
    if (filter === 'checked-in') {
      return record.status === 'PRESENT';
    }
    if (filter === 'not-checked-in') {
      return record.status !== 'PRESENT';
    }
    return true; // 'all'
  });

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'ABSENT':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'LATE':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'EXCUSED':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: AttendanceRecord['status']) => {
    const variants = {
      PRESENT: 'bg-green-100 text-green-800',
      ABSENT: 'bg-red-100 text-red-800',
      LATE: 'bg-amber-100 text-amber-800',
      EXCUSED: 'bg-blue-100 text-blue-800',
    };

    const labels = {
      PRESENT: 'Prezent',
      ABSENT: 'Absent',
      LATE: 'Întârziat',
      EXCUSED: 'Scutit',
    };

    return (
      <Badge className={variants[status]} variant="outline">
        {labels[status]}
      </Badge>
    );
  };

  const getMethodBadge = (method: AttendanceRecord['check_in_method']) => {
    const variants = {
      QR_CODE: 'bg-purple-100 text-purple-800',
      MANUAL: 'bg-gray-100 text-gray-800',
      GPS: 'bg-cyan-100 text-cyan-800',
      BULK: 'bg-indigo-100 text-indigo-800',
    };

    const labels = {
      QR_CODE: 'QR Code',
      MANUAL: 'Manual',
      GPS: 'GPS',
      BULK: 'Bulk',
    };

    return (
      <Badge className={variants[method]} variant="outline">
        {labels[method]}
      </Badge>
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Check-In Live
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Actualizat: {format(lastUpdate, 'HH:mm:ss', { locale: ro })}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchAttendanceData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="text-sm text-green-700">Prezent</div>
            <div className="text-2xl font-bold text-green-900">{checkedInCount}</div>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <div className="text-sm text-gray-700">Total Înscriși</div>
            <div className="text-2xl font-bold text-gray-900">{enrolledCount}</div>
          </div>
        </div>

        {/* Percentage Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progres</span>
            <span className="font-medium">
              {enrolledCount > 0 ? Math.round((checkedInCount / enrolledCount) * 100) : 0}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 transition-all duration-500"
              style={{
                width: `${enrolledCount > 0 ? (checkedInCount / enrolledCount) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Filters */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Toți ({attendanceRecords.length})</TabsTrigger>
            <TabsTrigger value="checked-in">
              Prezent ({attendanceRecords.filter((r) => r.status === 'PRESENT').length})
            </TabsTrigger>
            <TabsTrigger value="not-checked-in">
              Absent (
              {enrolledCount - attendanceRecords.filter((r) => r.status === 'PRESENT').length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Live Feed */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Se încarcă...</div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {filter === 'all'
                ? 'Niciun student nu s-a înregistrat încă'
                : filter === 'checked-in'
                  ? 'Niciun student prezent'
                  : 'Toți studenții sunt prezenți'}
            </div>
          ) : (
            filteredRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(record.profiles.first_name, record.profiles.last_name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {record.profiles.first_name} {record.profiles.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {format(new Date(record.checked_in_at), 'HH:mm', { locale: ro })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusIcon(record.status)}
                  {getStatusBadge(record.status)}
                  {getMethodBadge(record.check_in_method)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
