"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const weekly = [
  { week: "W1", phq9: 6, gad7: 5, pss: 9 },
  { week: "W2", phq9: 7, gad7: 6, pss: 11 },
  { week: "W3", phq9: 8, gad7: 6, pss: 10 },
  { week: "W4", phq9: 7, gad7: 5, pss: 9 },
]

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Analytics (Anonymous)</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Active Users" value="312" />
        <Metric label="Sessions Booked" value="23" />
        <Metric label="Forum Posts (week)" value="87" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Average Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              phq9: { label: "PHQ-9", color: "hsl(var(--chart-1))" },
              gad7: { label: "GAD-7", color: "hsl(var(--chart-2))" },
              pss: { label: "PSS", color: "hsl(var(--chart-3))" },
            }}
            className="h-[320px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekly} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="phq9" stroke="var(--color-phq9)" />
                <Line type="monotone" dataKey="gad7" stroke="var(--color-gad7)" />
                <Line type="monotone" dataKey="pss" stroke="var(--color-pss)" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <p className="mt-3 text-sm text-slate-600">
            Aggregates are displayed only above k-anonymity thresholds; no individual data is exposed.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-slate-600">{label}</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-semibold">{value}</CardContent>
    </Card>
  )
}
