"use client";

import { Users, FileWarning, CheckSquare } from "lucide-react";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';

import type { Employee, HrAdmin } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Progress } from "../ui/progress";
import { HrChatbot } from "./hr-chatbot";

interface HrDashboardProps {
  data: {
    workforcePulse: {
        totalPresent: number;
        totalWorkforce: number;
        onLeave: number;
        highFlightRisk: number;
        pendingApprovals: number;
    },
    flightRiskHotlist: Employee[];
    departmentCollaboration: {
        name: string;
        collaborationIndex: number;
        target: number;
    }[];
  };
  hrUser: HrAdmin;
}

export function HrDashboard({ data, hrUser }: HrDashboardProps) {
  return (
    <div className="flex gap-6">
        <div className="flex flex-col flex-1 gap-6">
         <header>
            <h1 className="text-3xl font-bold">HR Command Center</h1>
            <p className="text-muted-foreground">A high-level overview of workforce analytics and key metrics.</p>
         </header>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Present</CardTitle>
                <Users className="h-4 w-4 text-slate-gray" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.workforcePulse.totalPresent} / {data.workforcePulse.totalWorkforce}</div>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">On Leave</CardTitle>
                <Users className="h-4 w-4 text-slate-gray" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.workforcePulse.onLeave}</div>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Flight Risk</CardTitle>
                <FileWarning className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">{data.workforcePulse.highFlightRisk}</div>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <CheckSquare className="h-4 w-4 text-slate-gray" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.workforcePulse.pendingApprovals}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1 rounded-xl shadow-md">
                <CardHeader>
                    <CardTitle>High Priority: Flight Risk</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {data.flightRiskHotlist.map(employee => (
                        <div key={employee.id} className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={employee.avatarUrl} alt={employee.name} data-ai-hint="person portrait" />
                                <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-semibold text-sm text-charcoal">{employee.name}</p>
                                <p className="text-xs text-slate-gray">{employee.department}</p>
                                <div className="flex items-center gap-2">
                                    <Progress value={employee.flightRisk!.score} className="h-2 bg-orange-100 [&>div]:bg-orange-500" />
                                    <span className="text-xs font-bold text-orange-500">{employee.flightRisk!.score}%</span>
                                </div>
                            </div>
                            <Button asChild variant="secondary" size="sm">
                                <Link href={`/employee/${employee.id}`}>View Profile</Link>
                            </Button>
                        </div>
                    ))}
                     {data.flightRiskHotlist.length === 0 && (
                        <p className="text-sm text-center py-8 text-muted-foreground">No employees are currently identified as high flight risk. Great!</p>
                    )}
                </CardContent>
            </Card>

             <Card className="lg:col-span-2 rounded-xl shadow-md">
                <CardHeader>
                    <CardTitle>Department Collaboration Index</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                   <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={data.departmentCollaboration} layout="vertical" margin={{ top: 5, right: 20, left: 110, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                            }}/>
                        <Bar dataKey="collaborationIndex" barSize={20} radius={[0, 4, 4, 0]}>
                            {data.departmentCollaboration.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.collaborationIndex < entry.target ? "hsl(var(--pending))" : "hsl(var(--primary))"} />
                            ))}
                        </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
            </Card>
          </div>
      </div>
       <div className="w-96 flex-shrink-0">
         <div className="sticky top-6 h-[calc(100vh-3rem)]">
           <HrChatbot hrUser={hrUser} />
         </div>
       </div>
    </div>
  );
}
