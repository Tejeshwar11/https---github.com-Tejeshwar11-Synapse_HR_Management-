"use client";

import Image from "next/image";
import { TrendingDown, TrendingUp, LineChart, FileWarning, Sparkles } from "lucide-react";
import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

import type { Employee } from "@/lib/types";
import { AppSidebar } from "./app-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { mockFatimaAlJamil } from "@/lib/data";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Badge } from "../ui/badge";

interface DetailedEmployeeProfileProps {
  employee: Employee;
}

const GrowthPlanDialog = ({ employee }: { employee: Employee}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="lg" className="w-full text-lg transition-transform hover:scale-105 bg-orange-500 hover:bg-orange-600">
                    <Sparkles className="mr-2 h-5 w-5" /> Generate Growth Plan
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>AI-Generated Growth Plan for {employee.name}</DialogTitle>
                    <DialogDescription>
                        A tailored plan to support {employee.name.split(' ')[0]}'s growth and address flight risk factors.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-6">
                    <div className="space-y-2">
                        <h4 className="font-semibold text-charcoal">1. Address Key Concerns</h4>
                        <ul className="list-disc pl-5 text-sm text-slate-gray space-y-1">
                           {employee.flightRisk?.contributingFactors.map((factor, i) => (
                                <li key={i}>
                                    <strong>{factor.startsWith('↓') ? 'Mitigate Decreased Engagement:' : 'Address Increased Strain:'}</strong>
                                    {factor.includes('collaboration') && " Schedule a skip-level meeting to discuss their current projects and team dynamics. Pair them with a junior engineer for a mentorship opportunity to foster engagement."}
                                    {factor.includes('leave') && " Review recent leave patterns. Open a supportive conversation about workload and well-being. Ensure they are aware of company mental health resources."}
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div className="space-y-2">
                        <h4 className="font-semibold text-charcoal">2. Strategic Skill Development</h4>
                         <p className="text-sm text-slate-gray">Enroll {employee.name.split(' ')[0]} in the upcoming **Advanced Project Management** internal workshop to build leadership skills. Assign a stretch project that aligns with their stated interest in `System Architecture`.</p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-semibold text-charcoal">3. Recognition & Impact</h4>
                        <p className="text-sm text-slate-gray">Publicly recognize their recent contributions in the next team meeting. Create a clear line of sight between their work and its impact on company-wide goals to increase their sense of value.</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export function DetailedEmployeeProfile({ employee }: DetailedEmployeeProfileProps) {
  const flightRiskData = [
      {
        name: 'Flight Risk',
        value: employee.flightRisk?.score || 0,
        fill: employee.flightRisk && employee.flightRisk.score > 70 ? 'hsl(var(--warning))' : 'hsl(var(--primary))',
      },
  ];

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar userRole="hr" employee={mockFatimaAlJamil} />
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

                </TabsList>
                <TabsContent value="overview" className="mt-4">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <Card className="lg:col-span-1 rounded-xl shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><FileWarning className={employee.flightRisk && employee.flightRisk.score > 70 ? "text-orange-500" : "text-primary"}/> Predictive Insights</CardTitle>
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
                                          {employee.flightRisk?.score || 0}%
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
                                         {!employee.flightRisk && (
                                            <p className="text-center text-slate-gray">No significant flight risk factors identified.</p>
                                        )}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="lg:col-span-2 rounded-xl shadow-md">
                             <CardHeader>
                                <CardTitle>Action Center</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                               {employee.flightRisk && employee.flightRisk.score > 70 ? (
                                    <GrowthPlanDialog employee={employee} />
                               ) : (
                                 <Button size="lg" className="w-full text-lg transition-transform hover:scale-105">
                                    <Sparkles className="mr-2 h-5 w-5" /> Generate Growth Plan
                                 </Button>
                               )}

                                <div className="border-t pt-4 space-y-2">
                                    <h4 className="font-semibold text-charcoal mb-2">Basic Information</h4>
                                    <p><strong className="font-medium text-charcoal w-24 inline-block">Employee ID:</strong> {employee.id}</p>
                                    <p><strong className="font-medium text-charcoal w-24 inline-block">Email:</strong> {employee.email}</p>
                                    <p><strong className="font-medium text-charcoal w-24 inline-block">Role:</strong> {employee.role}</p>
                                    <p><strong className="font-medium text-charcoal w-24 inline-block">Department:</strong> {employee.department}</p>
                                </div>
                                <div className="border-t pt-4">
                                     <h4 className="font-semibold text-charcoal mb-2">Skills</h4>
                                     <div className="flex flex-wrap gap-2">
                                        {employee.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                                     </div>
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
                           <Image src={'/heatmap-placeholder.png'} alt="Presence Heatmap" width={1200} height={700} className="rounded-lg border" data-ai-hint="office floor plan heatmap" />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
      </div>
    </div>
  );
}
