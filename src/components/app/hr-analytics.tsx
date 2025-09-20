"use client";

import { useMemo } from "react";
import { BarChart3, TrendingUp, Users, PieChart as PieIcon, Briefcase } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { subDays, format, parseISO } from 'date-fns';

import type { Employee } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DEPARTMENTS } from "@/lib/data";


interface HrAnalyticsDashboardProps {
  employees: Employee[];
}

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];


export function HrAnalyticsDashboard({ employees }: HrAnalyticsDashboardProps) {

    const analyticsData = useMemo(() => {
        const thirtyDaysAgo = subDays(new Date(), 30);
        const dailyAttendance = Array.from({ length: 30 }).map((_, i) => {
            const date = subDays(new Date(), 29 - i);
            const dateStr = format(date, 'yyyy-MM-dd');
            const present = employees.filter(e => e.attendance.some(a => a.date === dateStr && a.status === 'present')).length;
            const onLeave = employees.filter(e => e.attendance.some(a => a.date === dateStr && a.status === 'on-leave')).length;
            return {
                date: format(date, 'MMM d'),
                Present: present,
                'On Leave': onLeave,
            };
        });

        const leaveTypes = employees.flatMap(e => e.requests)
            .filter(r => r.status === 'Approved' && r.type === 'leave')
            .reduce((acc, req) => {
                const reason = req.reason || 'Other';
                const key = reason.split(' ')[0].replace(/,/g, '');
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);
        
        const leaveTypeData = Object.entries(leaveTypes).map(([name, value]) => ({ name, value }));

        const flightRiskByDept = DEPARTMENTS.map(dept => {
            const deptEmployees = employees.filter(e => e.department === dept);
            const highRiskCount = deptEmployees.filter(e => e.flightRisk && e.flightRisk.score > 70).length;
            return {
                name: dept,
                'High Risk Employees': highRiskCount,
                'Total Employees': deptEmployees.length,
            };
        });


        return { dailyAttendance, leaveTypeData, flightRiskByDept };
    }, [employees]);


  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Workforce Analytics</h1>
        <p className="text-muted-foreground">
          Deep dive into attendance trends, leave patterns, and predictive insights.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Daily Attendance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.5%</div>
            <p className="text-xs text-muted-foreground">Based on the last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leave Days (YTD)</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,402</div>
            <p className="text-xs text-muted-foreground">+15% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Flight Risk</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">28%</div>
            <p className="text-xs text-muted-foreground">Average score across all employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Common Leave</CardTitle>
            <PieIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Personal</div>
            <p className="text-xs text-muted-foreground">32% of all approved leaves</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trend (Last 30 Days)</CardTitle>
            <CardDescription>Daily count of present vs. on-leave employees.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.dailyAttendance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false}/>
                    <Tooltip
                        contentStyle={{
                           background: "hsl(var(--background))",
                           border: "1px solid hsl(var(--border))",
                           borderRadius: "var(--radius)",
                        }}
                    />
                    <Legend iconSize={10} />
                    <Bar dataKey="Present" stackId="a" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="On Leave" stackId="a" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Leave Type Distribution (YTD)</CardTitle>
            <CardDescription>Breakdown of all approved leaves by reason.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.leaveTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                    return (
                      <text x={x} y={y} fill="currentColor" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs">
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  {analyticsData.leaveTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                   contentStyle={{
                       background: "hsl(var(--background))",
                       border: "1px solid hsl(var(--border))",
                       borderRadius: "var(--radius)",
                    }}
                />
                <Legend iconSize={10}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Flight Risk by Department</CardTitle>
          <CardDescription>Number of employees with a flight risk score over 70%.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.flightRiskByDept} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} angle={-45} textAnchor="end" interval={0} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{
                           background: "hsl(var(--background))",
                           border: "1px solid hsl(var(--border))",
                           borderRadius: "var(--radius)",
                        }}
                    />
                    <Legend wrapperStyle={{paddingTop: '20px'}}/>
                    <Bar dataKey="High Risk Employees" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}
