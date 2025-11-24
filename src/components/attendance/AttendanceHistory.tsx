import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SessionDetailCard } from './SessionDetailCard';
import { Award, Clock } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  status: string;
  check_in_method: string | null;
  checked_in_at: string | null;
  hours_credited: number;
  session: {
    date: string;
    start_time: string;
    end_time: string;
    location: string;
    activity_title: string;
    activity_category: string;
  };
}

interface AttendanceHistoryProps {
  attendanceRecords: AttendanceRecord[];
  activityId?: string; // Optional: filter by specific activity
}

export function AttendanceHistory({ attendanceRecords, activityId }: AttendanceHistoryProps) {
  // Filter by activity if specified
  const filteredRecords = activityId
    ? attendanceRecords // Would need activity_id in the data to filter
    : attendanceRecords;

  // Calculate total hours (only PRESENT status)
  const totalHours = filteredRecords
    .filter((record) => record.status === 'PRESENT')
    .reduce((sum, record) => sum + Number(record.hours_credited), 0);

  // Count by status
  const presentCount = filteredRecords.filter((r) => r.status === 'PRESENT').length;
  const absentCount = filteredRecords.filter((r) => r.status === 'ABSENT').length;
  const pendingCount = filteredRecords.filter((r) => r.status === 'PENDING').length;

  if (filteredRecords.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Niciun istoric de prezență</p>
            <p className="text-sm">
              Istoricul tău de prezență va apărea aici după ce participi la sesiuni
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            Rezumat Prezență
          </CardTitle>
          <CardDescription>Progresul tău de voluntariat</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Hours */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-blue-600">{totalHours.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground mt-1">Ore Totale</div>
            </div>

            {/* Present Count */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-green-600">{presentCount}</div>
              <div className="text-sm text-muted-foreground mt-1">Prezent</div>
            </div>

            {/* Absent Count */}
            {absentCount > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-red-600">{absentCount}</div>
                <div className="text-sm text-muted-foreground mt-1">Absent</div>
              </div>
            )}

            {/* Pending Count */}
            {pendingCount > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
                <div className="text-sm text-muted-foreground mt-1">În Așteptare</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Attendance History List */}
      <Card>
        <CardHeader>
          <CardTitle>Istoric Sesiuni</CardTitle>
          <CardDescription>
            {filteredRecords.length} {filteredRecords.length === 1 ? 'sesiune' : 'sesiuni'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <SessionDetailCard key={record.id} attendance={record} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
