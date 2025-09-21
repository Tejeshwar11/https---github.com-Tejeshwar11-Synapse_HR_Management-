

"use client";

import { useState, useEffect } from "react";
import {
  Flame,
  MessageCircle,
  TrendingDown,
  WifiOff,
  Smile,
  Frown,
  Meh,
  Award,
  Sparkles,
  Wifi,
} from "lucide-react";
import {
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from 'date-fns';

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
import { Badge } from "@/components/ui/badge";
import { LeaveRequestDialog } from "./leave-request-dialog";
import { GiveKudosDialog } from "./give-kudos-dialog";
import { EmployeeChatbot } from "./employee-chatbot";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useWifi } from "@/lib/hooks/use-wifi";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";


const LiveClock = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  if (!time) return null;

  return <p className="font-mono text-sm text-slate-gray">{time}</p>;
};

const WeeklyWellnessPulse = () => {
    const { toast } = useToast();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (sentiment: string) => {
        setSubmitted(true);
        toast({
            title: "Thank you for your feedback!",
            description: `You've reported your workload is ${sentiment}.`,
        });
    }

    if (submitted) {
        return (
             <Card className="rounded-xl shadow-md">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Smile className="h-8 w-8 text-green-500 mb-2"/>
                    <p className="text-sm font-medium text-charcoal">Thanks for sharing!</p>
                    <p className="text-xs text-muted-foreground">Your feedback helps us improve.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="rounded-xl shadow-md">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-semibold">Weekly Wellness Pulse</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground mb-3">How is your workload feeling this week?</p>
                <TooltipProvider>
                    <div className="flex justify-around">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleSubmit('great')}><Smile className="h-7 w-7 text-green-500 hover:scale-110 transition-transform" /></Button>
                            </TooltipTrigger>
                            <TooltipContent>Great</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleSubmit('manageable')}><Meh className="h-7 w-7 text-yellow-500 hover:scale-110 transition-transform" /></Button>
                            </TooltipTrigger>
                            <TooltipContent>Manageable</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleSubmit('overwhelming')}><Frown className="h-7 w-7 text-red-500 hover:scale-110 transition-transform" /></Button>
                            </TooltipTrigger>
                            <TooltipContent>Overwhelming</TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>
            </CardContent>
        </Card>
    );
};


interface EmployeeDashboardProps {
  employee: Employee;
}

export function EmployeeDashboard({ employee: initialEmployee }: EmployeeDashboardProps) {
  const [employee, setEmployee] = useState(initialEmployee);
  const { isConnected, disconnectCount, simulateDisconnect, simulateReconnect } = useWifi();
  const { toast } = useToast();
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  
  useEffect(() => {
    if (isConnected === false && isPunchedIn) {
      setIsPunchedIn(false);
      toast({
        variant: "destructive",
        title: "Punched Out due to Disconnection",
        description: "Your attendance status has been updated.",
      });
    }
  }, [isConnected, isPunchedIn, toast]);

  useEffect(() => {
    if (disconnectCount > 2) {
      toast({
        variant: "destructive",
        title: "Half-Day Marked",
        description: "You have been marked for a half-day due to frequent Wi-Fi disconnections.",
      });
      setEmployee(e => ({...e, halfDays: (e.halfDays || 0) + 1, stats: { ...e.stats, leaveBalance: { ...e.stats.leaveBalance, used: e.stats.leaveBalance.used + 0.5}}}));
    }
  }, [disconnectCount, toast]);

  const handlePunch = () => {
    setIsPunchedIn(!isPunchedIn);
    toast({
      title: isPunchedIn ? "Punched Out" : "Punched In",
      description: `Your attendance has been recorded at ${new Date().toLocaleTimeString()}`,
    })
  }

  const handleNewRequest = (newRequest: Omit<LeaveRequest, "id" | "status" | "employeeId" | "employeeName" | "employeeAvatar">) => {
    const fullRequest = {
        ...newRequest,
        id: `req-${Date.now()}`,
        status: 'Pending' as const,
        employeeId: employee.id,
        employeeName: employee.name,
        employeeAvatar: employee.avatarUrl,
    };
    
    const isLeave = newRequest.type === 'leave';
    const startDate = parseISO(newRequest.startDate);
    const endDate = parseISO(newRequest.endDate);
    const daysRequested = Math.max(1, (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1);


    setEmployee(currentEmployee => ({
        ...currentEmployee,
        requests: [fullRequest, ...currentEmployee.requests],
        stats: {
          ...currentEmployee.stats,
          leaveBalance: {
            ...currentEmployee.stats.leaveBalance,
            used: isLeave ? currentEmployee.stats.leaveBalance.used + daysRequested : currentEmployee.stats.leaveBalance.used
          }
        }
    }));
  };
  
  const remainingLeave = employee.stats.leaveBalance.total - employee.stats.leaveBalance.used;
  const leaveData = [
    { name: "Used", value: employee.stats.leaveBalance.used, fill: "hsl(var(--primary))" },
    { name: "Remaining", value: remainingLeave, fill: "hsl(var(--muted))" },
  ];

  const collaborationData = [
      {
        name: 'Collaboration',
        value: employee.stats.collaborationIndex * 10,
        fill: 'hsl(var(--primary))',
      },
  ];

  return (
    <div className="flex-1 space-y-6">
       <header>
          <h1 className="text-3xl font-bold">Welcome back, {employee.name.split(" ")[0]}!</h1>
        </header>
        <Card className="rounded-xl shadow-md">
            <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-success' : 'bg-destructive animate-pulse'}`} />
                    <div>
                        <p className="font-semibold text-charcoal">Status: {isPunchedIn ? 'Punched In' : 'Punched Out'}</p>
                        <p className="text-sm text-slate-gray">{isConnected ? "Connected to Office Wi-Fi" : "Wi-Fi Disconnected"}</p>
                    </div>
                    <LiveClock />
                </div>
                <div className="flex gap-2">
                    <Button onClick={handlePunch} variant={isPunchedIn ? "outline" : "default"} disabled={!isConnected} className="w-32">
                      {isPunchedIn ? "Punch Out" : "Punch In"}
                    </Button>
                    <LeaveRequestDialog onNewRequest={handleNewRequest} />
                    <GiveKudosDialog />
                </div>
            </CardContent>
        </Card>

        {!isConnected && (
          <Alert variant="destructive">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>You are disconnected from the office Wi-Fi.</AlertTitle>
            <AlertDescription>Further disconnections may result in a half-day being marked.</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl shadow-md">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Leave Balance</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-charcoal">{remainingLeave} <span className="text-lg font-medium">Days</span></div>
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
                    <CardTitle className="text-base font-semibold">Half-Days This Quarter</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-charcoal">{employee.halfDays || 0}</div>
                    <TrendingDown className="h-10 w-10 text-destructive" />
                </CardContent>
            </Card>
             <Card className="rounded-xl shadow-md">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Collaboration Index</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-charcoal">{employee.stats.collaborationIndex}/10</div>
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
        
         <div className="grid gap-6 lg:grid-cols-3">
            <Card className="rounded-xl shadow-md lg:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>My Recent Requests</CardTitle>
                    <div className="flex gap-2">
                     <Button variant="destructive" size="sm" onClick={simulateDisconnect}><WifiOff className="mr-2 h-4 w-4"/>Simulate Disconnect</Button>
                     <Button variant="secondary" size="sm" onClick={simulateReconnect}><Wifi className="mr-2 h-4 w-4"/>Simulate Reconnect</Button>
                    </div>
                  </div>
                    <CardDescription>You have {employee.requests.filter(r => r.status === 'Pending').length} pending requests.</CardDescription>
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
                            {employee.requests.slice(0, 3).map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell className="font-medium capitalize">{req.type}</TableCell>
                                    <TableCell>{format(parseISO(req.startDate), 'd MMM')} - {format(parseISO(req.endDate), 'd MMM')}</TableCell>
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
            <WeeklyWellnessPulse />
        </div>
      <Sheet>
        <SheetTrigger asChild>
            <Button className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg transition-transform hover:scale-110">
                <Sparkles className="h-8 w-8"/>
            </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-muted/30">
             <EmployeeChatbot employee={employee}/>
        </SheetContent>
      </Sheet>

    </div>
  );
}
