'use client';

import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { type DistrictDistributionChartData } from '@/types';

const chartConfig = {
  count: {
    label: 'İlan Sayısı',
  },
  'chart-1': { color: 'var(--chart-1)' },
  'chart-2': { color: 'var(--chart-2)' },
  'chart-3': { color: 'var(--chart-3)' },
  'chart-4': { color: 'var(--chart-4)' },
  'chart-5': { color: 'var(--chart-5)' },
} satisfies ChartConfig;

export function DistrictDistributionChart({
  chartData,
}: {
  chartData: DistrictDistributionChartData;
}) {
  return (
    <ChartContainer className="w-full aspect-auto h-62.5" config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{ left: 0, right: 30 }}
      >
        <YAxis
          dataKey="district"
          type="category"
          tickLine={false}
          axisLine={false}
          width={100}
          className="text-xs font-medium"
        />
        <XAxis dataKey="count" type="number" hide />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="count" radius={10} barSize={24}>
          <LabelList
            dataKey="count"
            position="right"
            className="fill-foreground font-bold"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
