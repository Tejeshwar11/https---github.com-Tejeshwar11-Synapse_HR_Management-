"use client";

import { Users, FileWarning, CheckSquare, Calendar, Sparkles, UserCheck, Building } from "lucide-react";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';

import type { Employee, HrAdmin, LeaveRequest } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Progress } from "../ui/progress";
import { HrChatbot } from "./hr-chatbot";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

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
    pendingRequests: LeaveRequest[];
    upcomingAnniversaries: {name: string, date: string, years: number}[];
  };
  hrUser: HrAdmin;
}

export function HrDashboard({ data, hrUser }: HrDashboardProps) {
  const [openChat, setOpenChat] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
         <header>
            <h1 className="text-3xl font-bold">HR Command Center</h1>
            <p className="text-muted-foreground">A high-level overview of workforce analytics and key metrics.</p>
         </header>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Workforce</CardTitle>
                <Users className="h-4 w-4 text-slate-gray" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.workforcePulse.totalWorkforce}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                <UserCheck className="h-4 w-4 text-slate-gray" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.workforcePulse.totalPresent}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">On Leave</CardTitle>
                <Building className="h-4 w-4 text-slate-gray" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.workforcePulse.onLeave}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <CheckSquare className="h-4 w-4 text-slate-gray" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.workforcePulse.pendingApprovals}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-1">
            <Card>
                <CardHeader>
                    <CardTitle>High Priority: Flight Risk</CardTitle>
                     <CardDescription>Employees with a flight risk score greater than 70%.</CardDescription>
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
             <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                 <CardDescription>There are {data.pendingRequests.length} requests needing your attention.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                     {data.pendingRequests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                               <AvatarImage src={req.employeeAvatar} alt={req.employeeName} data-ai-hint="person portrait" />
                               <AvatarFallback>{req.employeeName ? req.employeeName.charAt(0) : '?'}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{req.employeeName}</p>
                                <p className="text-xs text-muted-foreground">{req.department}</p>
                            </div>
                           </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="capitalize">{req.type}</Badge></TableCell>
                        <TableCell>
                           {format(parseISO(req.startDate), "d MMM")} - {format(parseISO(req.endDate), "d MMM")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="outline">Approve</Button>
                            <Button size="sm" variant="destructive">Reject</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
      </div>
       <div className="lg:col-span-1 flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Department Collaboration Index</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                   <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={data.departmentCollaboration} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                            }}/>
                        <Bar dataKey="collaborationIndex" barSize={16} radius={[0, 4, 4, 0]}>
                            {data.departmentCollaboration.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.collaborationIndex < entry.target ? "hsl(var(--warning))" : "hsl(var(--primary))"} />
                            ))}
                        </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Company Anniversaries</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {data.upcomingAnniversaries.map(anniversary => (
                       <div key={anniversary.name} className="flex items-center gap-4">
                            <div className="bg-muted text-muted-foreground p-3 rounded-lg flex flex-col items-center justify-center">
                                <span className="text-sm font-bold">{anniversary.date.split(' ')[0]}</span>
                                <span className="text-xs">{anniversary.date.split(' ')[1]}</span>
                            </div>
                            <div>
                                <p className="font-semibold text-charcoal">{anniversary.name}</p>
                                <p className="text-sm text-muted-foreground">{anniversary.years} Years</p>
                            </div>
                       </div>
                    ))}
                </CardContent>
            </Card>
       </div>
       <Sheet open={openChat} onOpenChange={setOpenChat}>
        <SheetTrigger asChild>
            <Button className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg transition-transform hover:scale-110 z-50">
                <Sparkles className="h-8 w-8"/>
            </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-muted/30">
             <HrChatbot hrUser={hrUser}/>
        </SheetContent>
      </Sheet>
    </div>
  );
}
