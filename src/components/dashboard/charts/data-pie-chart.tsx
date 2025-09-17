'use client';

import { Pie, PieChart, ResponsiveContainer, Tooltip, Legend, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface DataPieChartProps {
  title: string;
  data: { name: string; value: number }[];
  dataKey: string;
  indexKey: string;
  className?: string;
  valueFormatter?: (value: number) => string;
}

const CustomTooltip = ({ active, payload, formatter }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const formattedValue = formatter ? formatter(data.value) : data.value;
    return (
      <div className="p-2 bg-background border rounded-md shadow-lg">
        <p className="font-bold">{data.name}</p>
        <p>
          <span className="font-semibold">Valor:</span> {formattedValue}
        </p>
      </div>
    );
  }

  return null;
};

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function DataPieChart({
  title,
  data,
  dataKey,
  indexKey,
  className,
  valueFormatter = (value) => value.toString(),
}: DataPieChartProps) {
  const chartData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [data]);

  return (
    <Card className={cn('shadow-lg', className)}>
      <CardHeader>
        <CardTitle className="text-xl font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Tooltip
              cursor={{ fill: 'hsl(var(--accent))', opacity: 0.3 }}
              content={<CustomTooltip formatter={valueFormatter} />}
            />
            <Legend
              verticalAlign="bottom"
              height={48}
              iconSize={10}
              wrapperStyle={{ fontSize: '12px' }}
            />
            <Pie
              data={chartData}
              dataKey={dataKey}
              nameKey={indexKey}
              cx="50%"
              cy="50%"
              outerRadius={100}
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                return (
                  <text
                    x={x}
                    y={y}
                    fill="hsl(var(--foreground))"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    className="text-xs"
                  >
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
