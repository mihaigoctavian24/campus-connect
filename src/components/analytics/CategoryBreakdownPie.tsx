'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CategoryData {
  category: string;
  hours: number;
  color?: string;
}

interface CategoryBreakdownPieProps {
  data: CategoryData[];
  title?: string;
  description?: string;
}

// Culorile pentru categorii - paletă consistentă cu tema
const CATEGORY_COLORS = [
  '#001f3f', // Navy (primary)
  '#FFD700', // Gold (accent)
  '#3b82f6', // Blue
  '#22c55e', // Green
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#84cc16', // Lime
];

export function CategoryBreakdownPie({
  data,
  title = 'Distribuție pe categorii',
  description = 'Orele tale de voluntariat împărțite pe categorii de activități',
}: CategoryBreakdownPieProps) {
  const chartData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      color: item.color || CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }));
  }, [data]);

  const totalHours = useMemo(() => {
    return data.reduce((sum, item) => sum + item.hours, 0);
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

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: CategoryData & { color: string } }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.hours / totalHours) * 100).toFixed(1);
      return (
        <div className="rounded-lg border bg-white p-3 shadow-lg">
          <p className="font-medium" style={{ color: data.color }}>
            {data.category}
          </p>
          <p className="text-sm text-muted-foreground">
            {data.hours}h ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = (props: {
    cx?: number;
    cy?: number;
    midAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    percent?: number;
  }) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;

    // Guard against undefined values
    if (
      cx === undefined ||
      cy === undefined ||
      midAngle === undefined ||
      innerRadius === undefined ||
      outerRadius === undefined ||
      percent === undefined
    ) {
      return null;
    }

    if (percent < 0.05) return null; // Nu afișa labeluri pentru valori mici

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

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
            <p className="text-sm text-muted-foreground">{data.length} categorii</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                innerRadius={40}
                fill="#8884d8"
                dataKey="hours"
                nameKey="category"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value, _entry) => {
                  const item = chartData.find((d) => d.category === value);
                  return (
                    <span className="text-sm">
                      {value} ({item?.hours || 0}h)
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
