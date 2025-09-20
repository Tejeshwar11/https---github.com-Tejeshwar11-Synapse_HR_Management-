"use client";

import Image from "next/image";
import { TrendingDown, TrendingUp, LineChart, FileWarning } from "lucide-react";
import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

import type { Employee } from "@/lib/types";
import { AppSidebar } from "./app-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface DetailedEmployeeProfileProps {
  employee: Employee;
}

export function DetailedEmployeeProfile({ employee }: DetailedEmployeeProfileProps) {
  const flightRiskData = [
      {
        name: 'Flight Risk',
        value: employee.flightRisk?.score || 0,
        fill: 'hsl(var(--warning))',
      },
  ];

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar userRole="hr" employee={employee} />
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-30 flex h-auto items-start gap-4 border-b bg-background px-4 py-4 sm:static sm:border-0 sm:bg-transparent sm:px-6">
            <Avatar className="h-20 w-20">
                <AvatarImage src={employee.avatarUrl} alt={employee.name} data-ai-hint="person portrait" />
                <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-3xl">{employee.name}</h1>
                <p className="text-slate-gray">{employee.role}</p>
                <p className="text-sm text-slate-gray/70">{employee.department}</p>
            </div>
        </header>

        <main className="flex-1 p-4 sm:px-6 sm:py-0 space-y-6">
            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="presence">Presence Analytics</TabsTrigger>
                    <TabsTrigger value="history">Full History</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <Card className="lg:col-span-1 rounded-xl shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><FileWarning className="text-orange-500"/> Predictive Insights</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-center">
                                <div className="h-40 w-40 mx-auto">
                                   <ResponsiveContainer width="100%" height="100%">
                                     <RadialBarChart
                                        startAngle={90}
                                        endAngle={-270}
                                        innerRadius="70%"
                                        outerRadius="100%"
                                        barSize={12}
                                        data={flightRiskData}
                                     >
                                        <RadialBar background dataKey="value" cornerRadius={50} />
                                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-charcoal">
                                          {employee.flightRisk?.score}%
                                        </text>
                                         <text x="50%" y="68%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-slate-gray">
                                          Flight Risk
                                        </text>
                                     </RadialBarChart>
                                   </ResponsiveContainer>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-charcoal mb-2">Contributing Factors</h4>
                                    <ul className="space-y-2 text-sm text-slate-gray text-left">
                                        {employee.flightRisk?.contributingFactors.map((factor, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                {factor.startsWith('↓') ? <TrendingDown className="h-4 w-4 text-destructive" /> : <TrendingUp className="h-4 w-4 text-success" />}
                                                <span>{factor.substring(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="lg:col-span-2 rounded-xl shadow-md">
                             <CardHeader>
                                <CardTitle>Action Center</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Button size="lg" className="w-full text-lg transition-transform hover:scale-105">Generate Growth Plan</Button>
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold text-charcoal mb-2">Basic Information</h4>
                                    <p><strong className="font-medium text-charcoal">Employee ID:</strong> {employee.id}</p>
                                    <p><strong className="font-medium text-charcoal">Email:</strong> {employee.email}</p>
                                    <p><strong className="font-medium text-charcoal">Role:</strong> {employee.role}</p>
                                    <p><strong className="font-medium text-charcoal">Department:</strong> {employee.department}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="presence" className="mt-4">
                     <Card className="rounded-xl shadow-md">
                        <CardHeader>
                            <CardTitle>Presence Analytics</CardTitle>
                            <CardDescription>Heatmap showing where the employee spends their time on-site.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Image src={employee.analytics?.presenceHeatmapUrl || '/heatmap-placeholder.png'} alt="Presence Heatmap" width={1200} height={700} className="rounded-lg border" data-ai-hint="office floor plan heatmap" />
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="history" className="mt-4">
                     <Card className="rounded-xl shadow-md">
                        <CardHeader>
                            <CardTitle>Full History</CardTitle>
                            <CardDescription>Coming Soon: A complete log of attendance, leaves, and performance reviews.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-64 flex items-center justify-center text-slate-gray">
                            <p>Full historical data will be displayed here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
      </div>
    </div>
  );
}
