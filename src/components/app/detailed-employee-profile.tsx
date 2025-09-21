"use client";

import React, { useState, useMemo } from 'react';
import Image from "next/image";
import { TrendingDown, TrendingUp, LineChart, FileWarning, Sparkles, Calendar as CalendarIcon, Search, Download } from "lucide-react";
import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { DateRange } from "react-day-picker";
import { format, parseISO } from 'date-fns';


import type { AttendanceRecord, Employee } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { mockFatimaAlJamil } from "@/lib/data";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { AttendanceCalendar } from './attendance-calendar';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { HrSidebar } from './hr-sidebar';

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

const AttendanceDataTable = ({ attendance }: { attendance: AttendanceRecord[] }) => {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    const filteredData = useMemo(() => {
        return attendance.filter(record => {
            const date = parseISO(record.date);
            const inRange = !dateRange || (
                (!dateRange.from || date >= dateRange.from) &&
                (!dateRange.to || date <= dateRange.to)
            );
            const matchesSearch = searchTerm === '' || record.status.toLowerCase().includes(searchTerm.toLowerCase());
            return inRange && matchesSearch;
        });
    }, [attendance, searchTerm, dateRange]);

    const handleExport = () => {
        toast({
            title: "Exporting Data",
            description: "Your CSV file is being generated and will download shortly."
        });
        // In a real app, this would trigger a CSV download.
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4 justify-between items-center">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by status..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <div className="flex gap-2">
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={'outline'}
                            className={cn(
                            'w-[300px] justify-start text-left font-normal',
                            !dateRange && 'text-muted-foreground'
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                                </>
                            ) : (
                                format(dateRange.from, 'LLL dd, y')
                            )
                            ) : (
                            <span>Pick a date range</span>
                            )}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                        />
                        </PopoverContent>
                    </Popover>
                    <Button onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
                </div>
            </div>
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Punch-In</TableHead>
                            <TableHead>Punch-Out</TableHead>
                            <TableHead className="text-right">Total Hours</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                       {filteredData.slice(0, 100).map(record => ( // Limit to 100 for performance
                           <TableRow key={record.date}>
                               <TableCell>{format(parseISO(record.date), 'MMM d, yyyy')}</TableCell>
                               <TableCell><Badge variant={
                                   record.status === 'present' ? 'default' :
                                   record.status === 'absent' ? 'destructive' :
                                   record.status === 'half-day' ? 'outline' : 'secondary'
                               }
                               className={
                                   record.status === 'present' ? 'bg-success hover:bg-success/90' :
                                   record.status === 'half-day' ? 'bg-warning text-warning-foreground border-warning' :
                                   record.status === 'on-leave' ? 'bg-primary/80' : ''
                               }
                               >{record.status.replace('-', ' ')}</Badge></TableCell>
                               <TableCell>{record.punchIn || 'N/A'}</TableCell>
                               <TableCell>{record.punchOut || 'N/A'}</TableCell>
                               <TableCell className="text-right">{record.totalHours ? `${record.totalHours}h` : 'N/A'}</TableCell>
                           </TableRow>
                       ))}
                       {filteredData.length === 0 && (
                           <TableRow>
                               <TableCell colSpan={5} className="text-center h-24">No records found for the selected criteria.</TableCell>
                           </TableRow>
                       )}
                    </TableBody>
                </Table>
                 {filteredData.length > 100 && (
                    <div className="p-4 text-xs text-muted-foreground">Showing first 100 of {filteredData.length} records. Use filters to narrow results.</div>
                )}
            </div>
        </div>
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
  
  const subtitle = employee.flightRisk ? 
    `${employee.role} • Flight Risk: ${employee.flightRisk.score}% (${employee.flightRisk.score > 70 ? 'High' : 'Low'})` 
    : employee.role;


  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <HrSidebar employee={mockFatimaAlJamil} />
      <div className="flex flex-col flex-1 sm:pl-14">
        <header className="sticky top-0 z-10 flex h-auto items-start gap-4 border-b bg-background px-4 py-4 sm:px-6 sm:py-6">
           <div className='relative w-full rounded-lg overflow-hidden p-6 min-h-[160px] flex items-end'>
                <Image
                    src="https://images.unsplash.com/photo-1531875456248-975055b4044b?q=80&w=2832&auto=format&fit=crop"
                    alt="Profile header background"
                    fill
                    className="object-cover"
                    data-ai-hint="abstract texture"
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-black/10'></div>
                <div className="flex items-center gap-4 relative">
                    <Avatar className="h-20 w-20 border-4 border-background">
                        <AvatarImage src={employee.avatarUrl} alt={employee.name} data-ai-hint="person portrait" />
                        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className='text-white'>
                        <h1 className="text-3xl font-bold">{employee.name}</h1>
                        <p className="text-white/80">{subtitle}</p>
                    </div>
                </div>
           </div>
        </header>

        <main className="flex-1 p-4 sm:px-6 sm:py-0 space-y-6 mb-6">
            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="attendance">Complete Attendance History</TabsTrigger>
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
                                    <TooltipProvider>
                                        <ul className="space-y-2 text-sm text-slate-gray text-left">
                                            {employee.flightRisk?.contributingFactors.map((factor, i) => (
                                                <Tooltip key={i}>
                                                    <TooltipTrigger asChild>
                                                        <li className="flex items-center gap-2 cursor-help">
                                                            {factor.startsWith('↓') ? <TrendingDown className="h-4 w-4 text-destructive" /> : <TrendingUp className="h-4 w-4 text-success" />}
                                                            <span>{factor.substring(2)}</span>
                                                        </li>
                                                    </TooltipTrigger>
                                                     <TooltipContent>
                                                        <p>This employee's time in designated collaborative zones has decreased by 30% this quarter.</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                            {!employee.flightRisk && (
                                                <p className="text-center text-slate-gray">No significant flight risk factors identified.</p>
                                            )}
                                        </ul>
                                    </TooltipProvider>
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
                <TabsContent value="attendance" className="mt-4">
                    <Card className="rounded-xl shadow-md">
                        <CardHeader>
                            <CardTitle>Complete Attendance History</CardTitle>
                            <CardDescription>Full 3-year attendance record for {employee.name}.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Tabs defaultValue="calendar">
                               <TabsList>
                                   <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                                   <TabsTrigger value="data">Data View</TabsTrigger>
                               </TabsList>
                               <TabsContent value="calendar" className="mt-4">
                                   <div className="flex justify-center">
                                     <AttendanceCalendar attendance={employee.attendance} />
                                   </div>
                               </TabsContent>
                               <TabsContent value="data" className="mt-4">
                                   <AttendanceDataTable attendance={employee.attendance} />
                               </TabsContent>
                           </Tabs>
                        </CardContent>
                    </Card>
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
