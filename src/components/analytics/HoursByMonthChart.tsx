'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MonthlyHoursData {
  month: string;
  hours: number;
  approved: number;
  pending: number;
}

interface HoursByMonthChartProps {
  data: MonthlyHoursData[];
  title?: string;
  description?: string;
}

const MONTH_NAMES_RO = [
  'Ian',
  'Feb',
  'Mar',
  'Apr',
  'Mai',
  'Iun',
  'Iul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function HoursByMonthChart({
  data,
  title = 'Ore de voluntariat pe lună',
  description = 'Evoluția orelor tale de voluntariat în ultimele luni',
}: HoursByMonthChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      monthLabel: MONTH_NAMES_RO[parseInt(item.month.split('-')[1]) - 1] || item.month,
    }));
  }, [data]);

  const totalHours = useMemo(() => {
    return data.reduce((sum, item) => sum + item.hours, 0);
  }, [data]);

  const approvedHours = useMemo(() => {
    return data.reduce((sum, item) => sum + item.approved, 0);
  }, [data]);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Nu există date pentru a afișa graficul
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#001f3f]">{totalHours}h</p>
            <p className="text-sm text-muted-foreground">{approvedHours}h aprobate</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="monthLabel"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => `${value}h`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value: number, name: string) => {
                  const labels: Record<string, string> = {
                    hours: 'Total ore',
                    approved: 'Aprobate',
                    pending: 'În așteptare',
                  };
                  return [`${value}h`, labels[name] || name];
                }}
              />
              <Legend
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    hours: 'Total ore',
                    approved: 'Aprobate',
                    pending: 'În așteptare',
                  };
                  return labels[value] || value;
                }}
              />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#001f3f"
                strokeWidth={2}
                dot={{ fill: '#001f3f', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#001f3f' }}
              />
              <Line
                type="monotone"
                dataKey="approved"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: '#22c55e', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#22c55e' }}
              />
              <Line
                type="monotone"
                dataKey="pending"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#f59e0b', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#f59e0b' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
