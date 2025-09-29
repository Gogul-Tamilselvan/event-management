
'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { ChartTooltipContent, ChartContainer, type ChartConfig } from '@/components/ui/chart'

const chartConfig = {
  signups: {
    label: "Signups",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

type AnalyticsChartsProps = {
    data: { month: string; signups: number }[];
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  return (
    <ChartContainer config={chartConfig} className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} accessibilityLayer>
          <XAxis
            dataKey="month"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
              cursor={{fill: 'hsl(var(--muted))'}}
              content={<ChartTooltipContent />}
          />
          <Bar dataKey="signups" fill="var(--color-signups)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
