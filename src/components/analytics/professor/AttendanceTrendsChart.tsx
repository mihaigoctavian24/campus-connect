'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AttendanceData {
  date: string;
  present: number;
  absent: number;
  total: number;
}

interface AttendanceTrendsChartProps {
  data: AttendanceData[];
  title?: string;
  description?: string;
}

const MONTH_NAMES: Record<string, string> = {
  '01': 'Ian',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'Mai',
  '06': 'Iun',
  '07': 'Iul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Noi',
  '12': 'Dec',
};

function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split('-');
  return `${MONTH_NAMES[month] || month} ${year.slice(2)}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const total = payload.find((p: { dataKey: string }) => p.dataKey === 'total')?.value || 0;
    const present = payload.find((p: { dataKey: string }) => p.dataKey === 'present')?.value || 0;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;

    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium text-[#001f3f]">{formatDate(label)}</p>
        <div className="mt-2 space-y-1 text-sm">
          <p className="text-green-600">Prezenți: {present}</p>
          <p className="text-red-500">
            Absenți: {payload.find((p: { dataKey: string }) => p.dataKey === 'absent')?.value || 0}
          </p>
          <p className="text-gray-600">Total: {total}</p>
          <p className="font-medium text-[#001f3f] pt-1 border-t">Rata prezență: {rate}%</p>
        </div>
      </div>
    );
  }
  return null;
}

export function AttendanceTrendsChart({
  data,
  title = 'Tendințe Prezență',
  description = 'Evoluția prezenței la activități în timp',
}: AttendanceTrendsChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Nu există date de prezență pentru grafic
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate average attendance rate
  const totalPresent = data.reduce((sum, d) => sum + d.present, 0);
  const totalStudents = data.reduce((sum, d) => sum + d.total, 0);
  const avgRate = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Medie</p>
            <p className="text-2xl font-bold text-[#001f3f]">{avgRate}%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="present"
                name="Prezenți"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="absent"
                name="Absenți"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="total"
                name="Total"
                stroke="#6b7280"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
