"use client";

import React, { useState, useEffect } from "react";
import {
  Flame,
  MessageCircle,
} from "lucide-react";
import {
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

import type { Employee, LeaveRequest } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { LeaveRequestDialog } from "./leave-request-dialog";
import { EmployeeChatbot } from "./employee-chatbot";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";


interface EmployeeDashboardProps {
  employee: Employee;
}

const LiveClock = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <p className="font-mono text-sm text-slate-gray">{isClient ? time : '--:--:--'}</p>;
};


export function EmployeeDashboard({ employee: initialEmployee }: EmployeeDashboardProps) {
  const [employee, setEmployee] = useState(initialEmployee);

  const handleNewRequest = (newRequest: Omit<LeaveRequest, "id" | "status" | "employeeId" | "employeeName" | "employeeAvatar">) => {
    const fullRequest = {
        ...newRequest,
        id: `req-${Date.now()}`,
        status: 'Pending' as const,
        // These fields are just for the local state update. A real backend would handle this.
        employeeId: employee.id,
        employeeName: employee.name,
        employeeAvatar: employee.avatarUrl,
    };
    setEmployee(currentEmployee => ({
        ...currentEmployee,
        requests: [fullRequest, ...currentEmployee.requests],
    }));
  };
  
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
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-2xl">Welcome back, {employee.name.split(" ")[0]}!</h1>
           <LiveClock />
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
                        <LeaveRequestDialog onNewRequest={handleNewRequest} />
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
                        <div className="text-3xl font-bold text-charcoal">{employee.stats.leaveBalance.total - employee.stats.leaveBalance.used} <span className="text-lg font-medium">Days Left</span></div>
                         <div className="h-20 w-20">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={leaveData} dataKey="value" startAngle={90} endAngle={-270} innerRadius="70%" outerRadius="100%" cornerRadius={50} paddingAngle={2}>
                                    </Pie>
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
                                <TableHead>Reason</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employee.requests.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell className="font-medium capitalize">{req.type}</TableCell>
                                    <TableCell>{req.startDate} - {req.endDate}</TableCell>
                                    <TableCell>{req.reason}</TableCell>
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
      <Sheet>
        <SheetTrigger asChild>
            <Button className="absolute bottom-6 right-6 h-16 w-16 rounded-full shadow-lg transition-transform hover:scale-110">
                <MessageCircle className="h-8 w-8"/>
            </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
             <EmployeeChatbot employee={employee}/>
        </SheetContent>
      </Sheet>

    </div>
  );
}
