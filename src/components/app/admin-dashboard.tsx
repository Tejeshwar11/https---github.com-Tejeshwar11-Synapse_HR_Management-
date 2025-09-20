"use client";

import React, { useState } from "react";
import {
  Check,
  ClipboardList,
  Users,
  X,
  Clock,
  UserCheck
} from "lucide-react";
import { format, parseISO } from 'date-fns';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AdminDashboardProps {
  employees: Employee[];
  requests: LeaveRequest[];
}

export function AdminDashboard({ employees, requests: initialRequests }: AdminDashboardProps) {
  const [requests, setRequests] = useState<LeaveRequest[]>(initialRequests);
  const { toast } = useToast();

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
  const presentToday = 3; // Mock data

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">HR Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">Managed by the system</p>
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
            <p className="text-xs text-muted-foreground">{((presentToday / employees.length) * 100).toFixed(0)}% attendance</p>
          </CardContent>
        </Card>
      </div>
      
       <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests"><ClipboardList className="mr-2 h-4 w-4"/>Pending Requests</TabsTrigger>
          <TabsTrigger value="employees"><Users className="mr-2 h-4 w-4"/>Employee Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Approve Requests</CardTitle>
            </CardHeader>
            <CardContent>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
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
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                               <AvatarImage src={req.employeeAvatar} alt={req.employeeName} data-ai-hint="person portrait" />
                               <AvatarFallback>{req.employeeName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{req.employeeName}</span>
                           </div>
                        </TableCell>
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
                      <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        No pending requests.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>All Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Leave Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((emp) => (
                     <TableRow key={emp.id}>
                        <TableCell>
                           <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                               <AvatarImage src={emp.avatarUrl} alt={emp.name} data-ai-hint="person portrait"/>
                               <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{emp.name}</span>
                           </div>
                        </TableCell>
                        <TableCell>{emp.department}</TableCell>
                        <TableCell>{emp.leaveBalance} days</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="h-2.5 w-2.5 rounded-full bg-success" />
                            <span>Present</span>
                          </div>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
}
