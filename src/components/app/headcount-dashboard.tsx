"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, UserX, Target } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts"

interface HeadcountDashboardProps {
    currentHeadcount: number;
    attritionRiskCount: number;
}

const generateChartData = (current: number, risk: number) => {
    const data = [];
    const fiscalYearStart = new Date(new Date().getFullYear(), 0, 1);
    let actual = current - 50; // Start of year
    
    for (let i=0; i<12; i++) {
        const month = new Date(fiscalYearStart.getFullYear(), i, 1);
        const projected = current + Math.round(50 * (i/11)); // Projected growth
        
        // Simulate some hiring variance
        if (i > 0 && i < 11) {
            actual += Math.round(Math.random() * 8);
        } else if (i === 11) {
            actual = current; // End on current
        }

        data.push({
            month: month.toLocaleString('default', { month: 'short' }),
            'Actual Headcount': actual,
            'Projected Headcount': projected,
        })
    }
    return data;
}


export function HeadcountDashboard({ currentHeadcount, attritionRiskCount }: HeadcountDashboardProps) {
  const projectedNewRoles = 50;
  const backfillRoles = Math.ceil(attritionRiskCount * 0.5); // Assume 50% of high-risk employees might leave
  const totalHiringNeed = projectedNewRoles + backfillRoles;

  const chartData = generateChartData(currentHeadcount, attritionRiskCount);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Headcount Planning & Forecasting</h1>
        <p className="text-muted-foreground">
          Analyze current headcount, forecast future needs, and plan for growth.
        </p>
      </header>
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Headcount</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentHeadcount}</div>
            <p className="text-xs text-muted-foreground">Total active employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projected New Roles (Next FY)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectedNewRoles}</div>
            <p className="text-xs text-muted-foreground">Based on strategic growth</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecasted Backfills</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{backfillRoles}</div>
            <p className="text-xs text-muted-foreground">Based on attrition risk</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hiring Need</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalHiringNeed}</div>
            <p className="text-xs text-muted-foreground">Total roles to be filled next FY</p>
          </CardContent>
        </Card>
      </div>

      <Card>
          <CardHeader>
            <CardTitle>Projected Headcount vs. Actual</CardTitle>
            <CardDescription>Tracking hiring progress against the fiscal year forecast.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip contentStyle={{ background: "hsl(var(--background))" }}/>
                    <Legend />
                    <Area type="monotone" dataKey="Actual Headcount" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Projected Headcount" stroke="hsl(var(--muted-foreground))" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
    </div>
  )
}
