"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { WellnessStat } from "@/lib/types"
import { HeartPulse } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts"

interface SentimentDashboardProps {
    wellnessData: WellnessStat[]
}

const strainData = [
  { department: 'Sales', strain: 90 },
  { department: 'R&D', strain: 82 },
  { department: 'Engineering', strain: 65 },
  { department: 'Marketing', strain: 55 },
  { department: 'HR', strain: 30 },
];

export function SentimentDashboard({ wellnessData }: SentimentDashboardProps) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Workforce Sentiment</h1>
        <p className="text-muted-foreground">
          Analyze employee wellness and workload strain across the company.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Overall Company Wellness Score (Last 6 Months)</CardTitle>
            <CardDescription>A trend of the average self-reported wellness score.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wellnessData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis domain={[60, 100]} fontSize={12} />
                <Tooltip 
                     contentStyle={{
                           background: "hsl(var(--background))",
                           border: "1px solid hsl(var(--border))",
                           borderRadius: "var(--radius)",
                        }}
                />
                <Legend />
                <Line type="monotone" dataKey="score" name="Wellness Score" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Workload Strain by Department</CardTitle>
            <CardDescription>Heatmap showing which departments report the highest workload.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={strainData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                 <XAxis type="number" hide />
                 <YAxis dataKey="department" type="category" width={80} fontSize={12} axisLine={false} tickLine={false} />
                 <Tooltip cursor={{fill: "hsl(var(--muted))"}} contentStyle={{ background: "hsl(var(--background))"}} />
                 <Bar dataKey="strain" name="Workload Strain" fill="hsl(var(--warning))" radius={[0, 4, 4, 0]} background={{ fill: 'hsl(var(--muted))', radius: 4 }} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
