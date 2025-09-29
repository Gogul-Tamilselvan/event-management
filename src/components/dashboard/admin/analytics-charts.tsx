'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { analyticsData } from '@/lib/data'
import { ChartTooltipContent } from '@/components/ui/chart'

export function AnalyticsCharts() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={analyticsData.userSignups}>
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
        <Bar dataKey="signups" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
