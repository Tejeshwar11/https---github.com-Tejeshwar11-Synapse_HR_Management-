
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  BarChart,
  CalendarDays,
  Clock,
  Loader2,
  LogIn,
  LogOut,
  MessageSquare,
  Siren,
  Wifi,
  WifiOff,
} from "lucide-react";
import { format, parseISO } from "date-fns";

import type { Employee, LeaveRequest } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useWifi } from "@/lib/hooks/use-wifi";
import { AttendanceCalendar } from "./attendance-calendar";
import { LeaveRequestDialog } from "./leave-request-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  intelligentMissedPunchNotification,
  IntelligentMissedPunchNotificationInput,
} from "@/ai/flows/intelligent-missed-punch-notifications";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EmployeeChatbot } from "./employee-chatbot";

interface EmployeeDashboardProps {
  employee: Employee;
}

function LiveClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // This effect runs only on the client
    setTime(new Date()); // Set initial time
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="text-4xl font-bold font-mono text-center bg-muted/50 dark:bg-gray-800 p-2 rounded-lg min-w-[170px]">
      {time ? format(time, "HH:mm:ss") : "--:--:--"}
    </div>
  );
}

export function EmployeeDashboard({ employee: initialEmployee }: EmployeeDashboardProps) {
  const [employee, setEmployee] = useState(initialEmployee);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const { isConnected, disconnectCount, simulateDisconnect } = useWifi();
  const { toast } = useToast();
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (disconnectCount > 2) {
      toast({
        variant: "destructive",
        title: "Auto Half-Day Marked",
        description: "You have disconnected from the office Wi-Fi more than twice.",
      });
    }
  }, [disconnectCount, toast]);

  const handlePunchToggle = () => {
    setIsPunchedIn(!isPunchedIn);
    toast({
      title: `Successfully Punched ${isPunchedIn ? "Out" : "In"}`,
      description: `Time: ${format(new Date(), "HH:mm")}`,
    });
  };

  const handleNewRequest = (newRequest: Omit<LeaveRequest, "id" | "employeeId" | "employeeName" | "employeeAvatar">) => {
    const createdRequest: LeaveRequest = {
      ...newRequest,
      id: `req-${Date.now()}`,
      employeeId: employee.id,
      employeeName: employee.name,
      employeeAvatar: employee.avatarUrl,
    };
    setEmployee(prev => ({
      ...prev,
      requests: [createdRequest, ...prev.requests],
    }));
    toast({
      title: "Request Submitted",
      description: "Your request has been submitted for approval.",
    });
  };

  const handleMissedPunchCheck = async () => {
    setIsAiLoading(true);
    try {
      const now = new Date();
      const input: IntelligentMissedPunchNotificationInput = {
        employeeId: employee.id,
        employeeRole: employee.department, // Using department as a proxy for role
        missedPunchTime: now.toISOString(),
        usualPunchTime: new Date(now.setHours(9, 30, 0, 0)).toISOString(),
        dayOfWeek: format(now, 'EEEE'),
        recentLeave: employee.attendance.some(a => a.status === 'on-leave' && parseISO(a.date) > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)),
      };
      const result = await intelligentMissedPunchNotification(input);
      if (result.shouldNotify) {
        toast({
          variant: "destructive",
          title: "Missed Punch Alert",
          description: result.reason,
        });
      } else {
        toast({
          title: "No Action Needed",
          description: result.reason,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not check for missed punches.",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <CardContent className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6 relative">
          <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-r from-primary/10 to-accent/10 -z-10" />
          <div className="flex items-center gap-4">
            <Image
              src={employee.avatarUrl}
              alt={employee.name}
              width={80}
              height={80}
              className="rounded-full border-4 border-background shadow-lg"
              data-ai-hint="person portrait"
            />
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {employee.name.split(" ")[0]}!</h1>
              <p className="text-muted-foreground">{employee.department} Department</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 w-full md:w-auto">
            <LiveClock />
            <div className="flex gap-2 w-full">
              <Button onClick={handlePunchToggle} className="w-full" disabled={!isConnected}>
                {isPunchedIn ? <LogOut className="mr-2" /> : <LogIn className="mr-2" />}
                Punch {isPunchedIn ? "Out" : "In"}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <WifiOff className="mr-2" /> Disconnect
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Simulate Wi-Fi Disconnect?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This simulates disconnecting from the office Wi-Fi. Disconnecting more than twice will result in an automatic half-day.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={simulateDisconnect}>Disconnect</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
             <div className="flex items-center text-sm font-medium text-muted-foreground">
              {isConnected ? (
                <><Wifi className="w-4 h-4 mr-2 text-success" />Connected to Office Network</>
              ) : (
                <><WifiOff className="w-4 h-4 mr-2 text-destructive" />Disconnected. Reconnecting...</>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employee.leaveBalance} Days</div>
            <p className="text-xs text-muted-foreground">Remaining for the year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Half-Days Taken</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employee.halfDays}</div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">98.5%</div>
                <p className="text-xs text-muted-foreground">For the current month</p>
            </CardContent>
        </Card>
        <Card className="bg-primary/10 border-primary/50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Missed a Punch?</CardTitle>
            <Siren className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-center">
            <p className="text-xs text-muted-foreground mb-2">Let our AI assistant check if a notification is needed.</p>
            <Button size="sm" className="w-full" onClick={handleMissedPunchCheck} disabled={isAiLoading}>
              {isAiLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isAiLoading ? "Analyzing..." : "Check with AI"}
            </Button>
          </CardContent>
        </Card>
      </div>

       <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity">Your Activity</TabsTrigger>
          <TabsTrigger value="history">Full Attendance History</TabsTrigger>
          <TabsTrigger value="chatbot"><MessageSquare className="mr-2 h-4 w-4"/>Ask AI</TabsTrigger>
        </TabsList>
        <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Your Activity</CardTitle>
                 <CardDescription>A summary of your attendance for the current month and your recent requests.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-8 lg:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-4 text-lg">This Month's Calendar</h3>
                  <div className="p-4 border rounded-lg bg-card">
                      <AttendanceCalendar attendance={employee.attendance} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                       <h3 className="font-semibold text-lg">Leave & Regularization Requests</h3>
                       <LeaveRequestDialog onNewRequest={handleNewRequest} />
                  </div>
                  <div className="border rounded-lg">
                   <ScrollArea className="h-[300px]">
                    <TooltipProvider>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Dates</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {employee.requests.length > 0 ? (
                            employee.requests.map((req) => (
                              <TableRow key={req.id}>
                                <TableCell className="font-medium">
                                  {format(parseISO(req.startDate), "MMM d")}
                                  {req.startDate !== req.endDate && ` - ${format(parseISO(req.endDate), "MMM d")}`}
                                </TableCell>
                                <TableCell className="capitalize">{req.type}</TableCell>
                                <TableCell>
                                  <Tooltip>
                                    <TooltipTrigger className="max-w-[150px] truncate text-left">
                                      {req.reason}
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-[300px]">{req.reason}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Badge variant={req.status === 'approved' ? 'default' : req.status === 'rejected' ? 'destructive' : 'secondary'} className={req.status === 'approved' ? 'bg-success hover:bg-success/90' : ''}>
                                    {req.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                No requests found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TooltipProvider>
                    
                   </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
                <CardTitle>Full Attendance History</CardTitle>
                <CardDescription>Your complete attendance record for the last 3 years.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[600px] w-full p-4 border rounded-lg">
                    <AttendanceCalendar attendance={employee.attendance} months={36} />
                </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="chatbot">
            <EmployeeChatbot employee={employee} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
