"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Employee, AttendanceRecord } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface TeamCalendarProps {
  currentUser: Employee;
  teamMembers: Employee[];
}

// Generate the dates for the current week (Mon-Sun)
const getWeekDays = (date: Date): Date[] => {
  const start = new Date(date);
  const day = start.getDay();
  // Adjust to Monday if it's Sunday (0) or Saturday (6)
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(start.setDate(diff));

  return Array.from({ length: 7 }, (_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
};

export function TeamCalendar({ currentUser, teamMembers }: TeamCalendarProps) {
  const today = new Date();
  const weekDays = getWeekDays(today);
  const todayStr = format(today, "yyyy-MM-dd");

  const getStatusForDay = (employee: Employee, date: Date): AttendanceRecord["status"] | "weekend" | "future" => {
    const dateStr = format(date, "yyyy-MM-dd");
    if (date > today && dateStr !== todayStr) return "future";
    
    const dayOfWeek = date.getDay();
    if(dayOfWeek === 0 || dayOfWeek === 6) return "weekend";

    const attendanceRecord = employee.attendance.find((a) => a.date === dateStr);
    return attendanceRecord?.status || "present"; // Default to present if no record
  };

  const statusStyles: Record<string, string> = {
    present: "bg-success/20 text-success-foreground border-l-4 border-success",
    'on-leave': "bg-primary/20 text-primary-foreground border-l-4 border-primary",
    'half-day': "bg-warning/20 text-warning-foreground border-l-4 border-warning",
    absent: "bg-destructive/20 text-destructive-foreground border-l-4 border-destructive",
    weekend: "bg-muted/50",
    future: "bg-muted/30",
  };
  
  const statusText: Record<string, string> = {
    'on-leave': "On Leave",
    'half-day': "Half Day",
  }

  return (
    <div>
        <header className="mb-6">
            <h1 className="text-3xl font-bold">Team Calendar</h1>
            <p className="text-muted-foreground">
              See who's in and who's out in the {currentUser.department} department this week.
            </p>
        </header>
        <Card>
            <CardContent className="p-0">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                <thead className="bg-muted/50">
                    <tr>
                    <th className="sticky left-0 bg-muted/50 p-4 font-semibold w-64 z-10">Employee</th>
                    {weekDays.map((day) => (
                        <th key={day.toString()} className={cn(
                            "p-4 font-semibold text-center min-w-[120px]",
                             format(day, 'yyyy-MM-dd') === todayStr ? "text-primary" : ""
                        )}>
                        <div>{format(day, "eee")}</div>
                        <div className="text-lg">{format(day, "d")}</div>
                        </th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {teamMembers.map((member) => (
                    <tr key={member.id} className="border-t">
                        <td className="sticky left-0 bg-background p-3 w-64 z-10">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person portrait" />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                            <div className="font-medium text-charcoal">{member.name}</div>
                            <div className="text-xs text-slate-gray">{member.role}</div>
                            </div>
                        </div>
                        </td>
                        {weekDays.map((day) => {
                        const status = getStatusForDay(member, day);
                        return (
                            <td key={day.toString()} className="p-0 align-top">
                                <div className={cn(
                                    "h-full p-2 text-center text-xs font-semibold capitalize",
                                    statusStyles[status] || ""
                                )}>
                                    {statusText[status] || (status !== "present" && status !== "weekend" && status !== "future" ? status : "")}
                                </div>
                            </td>
                        );
                        })}
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </CardContent>
        </Card>
    </div>
  );
}
