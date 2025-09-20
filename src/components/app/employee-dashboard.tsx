"use client";

import {
  Calendar,
  Flame,
  Gauge,
  LogOut,
  MessageCircle,
  PlusCircle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

import type { Employee } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AppSidebar } from "./app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface EmployeeDashboardProps {
  employee: Employee;
}

export function EmployeeDashboard({ employee }: EmployeeDashboardProps) {
  const leaveData = [
    { name: "Used", value: employee.stats.leaveBalance.used, fill: "hsl(var(--primary))" },
    { name: "Remaining", value: employee.stats.leaveBalance.total - employee.stats.leaveBalance.used, fill: "hsl(var(--muted))" },
  ];

  const collaborationData = [
      {
        name: 'Collaboration',
        value: employee.stats.collaborationIndex * 10,
        fill: 'hsl(var(--primary))',
      },
  ];

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar userRole="employee" employee={employee} />
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-2xl">Welcome back, {employee.name.split(" ")[0]}!</h1>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0 space-y-6">
            <Card className="rounded-xl shadow-md">
                <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-success" />
                        <div>
                            <p className="font-semibold text-charcoal">Status: {employee.presence?.status}</p>
                            <p className="text-sm text-slate-gray">{employee.presence?.location}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button className="transition-transform hover:scale-105">Apply for Leave</Button>
                        <Button variant="secondary" className="transition-transform hover:scale-105">Request Regularization</Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="rounded-xl shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">Leave Balance</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-charcoal">{employee.stats.leaveBalance.used} / {employee.stats.leaveBalance.total} <span className="text-lg font-medium">Days</span></div>
                         <div className="h-20 w-20">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={leaveData} dataKey="value" startAngle={90} endAngle={-270} innerRadius="70%" outerRadius="100%" cornerRadius={50} paddingAngle={2}>
                                    </PieChart>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                 <Card className="rounded-xl shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">Perfect Streak</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-charcoal">{employee.stats.perfectStreak} <span className="text-lg font-medium">Days</span></div>
                        <Flame className="h-10 w-10 text-orange-400" />
                    </CardContent>
                </Card>
                 <Card className="rounded-xl shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">Collaboration Index</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-charcoal">{employee.stats.collaborationIndex} / 10</div>
                         <div className="h-20 w-20">
                           <ResponsiveContainer width="100%" height="100%">
                             <RadialBarChart
                                startAngle={90}
                                endAngle={-270}
                                innerRadius="70%"
                                outerRadius="100%"
                                barSize={10}
                                data={collaborationData}
                             >
                                <RadialBar background dataKey="value" cornerRadius={50} />
                             </RadialBarChart>
                           </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <Card className="rounded-xl shadow-md">
                <CardHeader>
                    <CardTitle>My Recent Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Dates</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employee.requests.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell className="font-medium">{req.type === 'leave' ? 'Annual Leave' : 'Regularization'}</TableCell>
                                    <TableCell>{req.startDate} - {req.endDate}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={
                                            req.status === 'Approved' ? 'default' 
                                            : req.status === 'Pending' ? 'secondary'
                                            : 'destructive'
                                        } className={req.status === 'Approved' ? 'bg-success' : req.status === 'Pending' ? 'bg-pending text-pending-foreground': ''}>
                                            {req.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </main>
      </div>
      <Button className="absolute bottom-6 right-6 h-16 w-16 rounded-full shadow-lg transition-transform hover:scale-110">
        <MessageCircle className="h-8 w-8"/>
      </Button>
    </div>
  );
}
