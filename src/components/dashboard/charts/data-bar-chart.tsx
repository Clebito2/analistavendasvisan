'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DataBarChartProps {
  title: string;
  data: { name: string; value: number }[];
  dataKey: string;
  indexKey: string;
  className?: string;
  valueFormatter?: (value: number) => string;
}

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const formattedValue = formatter ? formatter(data.value) : data.value;
    return (
      <div className="p-2 bg-background border rounded-md shadow-lg">
        <p className="font-bold">{label}</p>
        <p><span className="text-primary font-semibold">Valor:</span> {formattedValue}</p>
      </div>
    );
  }

  return null;
};


export function DataBarChart({
  title,
  data,
  dataKey,
  indexKey,
  className,
  valueFormatter = (value) => value.toString(),
}: DataBarChartProps) {
  return (
    <Card className={cn('shadow-lg', className)}>
      <CardHeader>
        <CardTitle className="text-xl font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30 }}>
            <XAxis type="number" hide />
            <YAxis
              dataKey={indexKey}
              type="category"
              stroke="hsl(var(--foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={120}
              interval={0}
              tick={{ transform: 'translate(0, 0)' }}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--accent))', opacity: 0.3 }}
              content={<CustomTooltip formatter={valueFormatter} />}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
            />
            <Bar dataKey={dataKey} fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
