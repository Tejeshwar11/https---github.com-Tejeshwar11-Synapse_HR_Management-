"use client";

import React, { useState, useMemo } from "react";
import {
  Check,
  ClipboardList,
  Users,
  X,
  Clock,
  UserCheck,
  Building,
  BarChart,
  ChevronDown
} from "lucide-react";
import { format, parseISO } from 'date-fns';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';


import type { Employee, LeaveRequest } from "@/lib/types";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DEPARTMENTS as departmentList } from "@/lib/data";


interface AdminDashboardProps {
  employees: Employee[];
  requests: LeaveRequest[];
}

const DEPARTMENTS = ['All', ...departmentList];

export function AdminDashboard({ employees, requests: initialRequests }: AdminDashboardProps) {
  const [requests, setRequests] = useState<LeaveRequest[]>(initialRequests);
  const { toast } = useToast();
  const [selectedDept, setSelectedDept] = useState('All');

  const filteredEmployees = useMemo(() => {
    if (selectedDept === 'All') return employees;
    return employees.filter(e => e.department === selectedDept);
  }, [employees, selectedDept]);

  const handleRequestAction = (requestId: string, status: "approved" | "rejected") => {
    setRequests(currentRequests =>
      currentRequests.map(req =>
        req.id === requestId ? { ...req, status } : req
      )
    );
    toast({
      title: `Request ${status}`,
      description: "The employee has been notified.",
    });
  };
  
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const presentToday = employees.filter(e => e.attendance?.[0]?.status === 'present').length;
  const onLeaveToday = employees.filter(e => e.attendance?.[0]?.status === 'on-leave').length;

  const departmentStats = useMemo(() => {
     const depts = departmentList;
     return depts.map(dept => {
        const deptEmployees = employees.filter(e => e.department === dept);
        const total = deptEmployees.length;
        if (total === 0) return { name: dept, total: 0, present: 0, onLeave: 0, absent: 0 };
        const present = deptEmployees.filter(e => e.attendance?.find(a => a.date === format(new Date(), 'yyyy-MM-dd'))?.status === 'present').length;
        const onLeave = deptEmployees.filter(e => e.attendance?.find(a => a.date === format(new Date(), 'yyyy-MM-dd'))?.status === 'on-leave').length;
        const absent = total - present - onLeave;
        return { name: dept, total, present, onLeave, absent };
     }).filter(Boolean);
  }, [employees]);


  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">HR Admin Dashboard</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto min-w-[180px] justify-between">
              {selectedDept === 'All' ? 'All Departments' : selectedDept}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
             {DEPARTMENTS.map(dept => (
              <DropdownMenuItem key={dept} onSelect={() => setSelectedDept(dept)}>
                {dept}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredEmployees.length}</div>
            <p className="text-xs text-muted-foreground">{selectedDept === 'All' ? 'Across all departments' : `In ${selectedDept}`}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting your approval</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentToday} / {employees.length}</div>
            <p className="text-xs text-muted-foreground">{((presentToday / employees.length) * 100).toFixed(0)}% attendance rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave Today</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onLeaveToday}</div>
            <p className="text-xs text-muted-foreground">Employees on approved leave</p>
          </CardContent>
        </Card>
      </div>
      
       <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview"><BarChart className="mr-2 h-4 w-4"/>Department Overview</TabsTrigger>
          <TabsTrigger value="requests"><ClipboardList className="mr-2 h-4 w-4"/>Pending Requests</TabsTrigger>
          <TabsTrigger value="employees"><Users className="mr-2 h-4 w-4"/>Employee Directory</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
            <Card>
              <CardHeader>
                  <CardTitle>Today's Attendance by Department</CardTitle>
                  <CardDescription>A snapshot of who's in, out, and on leave across the company.</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={departmentStats} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
                      <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} angle={-45} textAnchor="end" interval={0} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{
                           background: "hsl(var(--background))",
                           border: "1px solid hsl(var(--border))",
                           borderRadius: "var(--radius)",
                        }}
                        cursor={{fill: "hsl(var(--muted))"}}
                      />
                      <Legend iconSize={10} wrapperStyle={{paddingTop: '20px'}}/>
                      <Bar dataKey="total" fill="hsl(var(--muted))" name="Total Employees" />
                      <Bar dataKey="present" stackId="a" fill="hsl(var(--success))" name="Present" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="onLeave" stackId="a" fill="hsl(var(--primary))" name="On Leave"/>
                      <Bar dataKey="absent" stackId="a" fill="hsl(var(--destructive))" name="Absent" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
              </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Approve Requests</CardTitle>
              <CardDescription>There are {pendingRequests.length} requests needing your attention.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead className="hidden md:table-cell">Reason</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.length > 0 ? (
                    pendingRequests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                               <AvatarImage src={req.employeeAvatar} alt={req.employeeName} data-ai-hint="person portrait" />
                               <AvatarFallback>{req.employeeName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{req.employeeName}</p>
                                <p className="text-xs text-muted-foreground">{req.employeeId}</p>
                            </div>
                           </div>
                        </TableCell>
                        <TableCell>{employees.find(e => e.id === req.employeeId)?.department}</TableCell>
                        <TableCell><Badge variant="outline" className="capitalize">{req.type}</Badge></TableCell>
                        <TableCell>
                           {format(parseISO(req.startDate), "d MMM")} - {format(parseISO(req.endDate), "d MMM")}
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-xs truncate">{req.reason}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleRequestAction(req.id, 'approved')}>
                              <Check className="h-4 w-4 text-success" />
                            </Button>
                            <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleRequestAction(req.id, 'rejected')}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                        No pending requests.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
              <CardDescription>Showing {filteredEmployees.length} of {employees.length} employees.</CardDescription>
            </CardHeader>
            <CardContent>
             <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Leave Balance</TableHead>
                     <TableHead>Contact</TableHead>
                    <TableHead>Today's Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((emp) => (
                     <TableRow key={emp.id}>
                        <TableCell>
                           <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                               <AvatarImage src={emp.avatarUrl} alt={emp.name} data-ai-hint="person portrait"/>
                               <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{emp.name}</p>
                                <p className="text-xs text-muted-foreground">{emp.id}</p>
                            </div>
                           </div>
                        </TableCell>
                        <TableCell>{emp.department}</TableCell>
                        <TableCell>{emp.leaveBalance} days</TableCell>
                         <TableCell className="text-xs text-muted-foreground">{emp.email}</TableCell>
                        <TableCell>
                           <div className="flex items-center gap-2">
                            <Badge 
                                variant={
                                    emp.attendance?.[0]?.status === 'present' ? 'default'
                                    : emp.attendance?.[0]?.status === 'on-leave' ? 'outline'
                                    : emp.attendance?.[0]?.status === 'absent' ? 'destructive'
                                    : 'secondary'
                                }
                                className={
                                    emp.attendance?.[0]?.status === 'present' ? 'bg-success' : ''
                                }
                            >
                                {emp.attendance?.[0]?.status === 'present' ? 'Present' 
                                 : emp.attendance?.[0]?.status === 'on-leave' ? 'On Leave' 
                                 : emp.attendance?.[0]?.status === 'absent' ? 'Absent'
                                 : 'N/A'}
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
}
