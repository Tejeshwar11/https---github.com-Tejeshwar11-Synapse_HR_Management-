"use client";

import React, { useState } from "react";
import { DayPicker, Matcher } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import type { AttendanceRecord } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { holidayMap } from "@/lib/holidays";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";


interface AttendanceCalendarProps {
  attendance: AttendanceRecord[];
  initialYear?: number;
  initialMonth?: number;
}

const currentYear = new Date().getFullYear();
const YEARS = [currentYear, currentYear - 1, currentYear - 2];

export function AttendanceCalendar({ attendance, initialYear = currentYear, initialMonth = new Date().getMonth() }: AttendanceCalendarProps) {
  const [month, setMonth] = useState<Date>(new Date(initialYear, initialMonth));
  const selectedYear = month.getFullYear();

  const handleYearChange = (year: string) => {
    const newYear = parseInt(year, 10);
    setMonth(new Date(newYear, month.getMonth()));
  };

  const getAttendanceForDay = (date: Date): AttendanceRecord | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return attendance.find(a => a.date === dateStr);
  }

  const holidayDays: Matcher[] = Array.from(holidayMap.keys()).map(dateStr => parseISO(dateStr));
  const presentDays: Matcher[] = attendance.filter(a => a.status === 'present').map(a => parseISO(a.date));
  const absentDays: Matcher[] = attendance.filter(a => a.status === 'absent').map(a => parseISO(a.date));
  const halfDays: Matcher[] = attendance.filter(a => a.status === 'half-day').map(a => parseISO(a.date));
  const onLeaveDays: Matcher[] = attendance.filter(a => a.status === 'on-leave').map(a => parseISO(a.date));

  const CustomDay = ({ date }: { date: Date }) => {
    const attendanceRecord = getAttendanceForDay(date);
    const dayContent = (
      <div className="relative w-full h-full flex items-center justify-center">
        {format(date, "d")}
      </div>
    );

    if (attendanceRecord?.punchIn && attendanceRecord?.punchOut) {
      return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{dayContent}</TooltipTrigger>
                <TooltipContent>
                <p>Punch In: {attendanceRecord.punchIn}</p>
                <p>Punch Out: {attendanceRecord.punchOut}</p>
                <p>Total Hours: {attendanceRecord.totalHours}h</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      );
    }
    return dayContent;
  };

  const Caption = () => (
     <div className="flex justify-center items-center relative w-full px-10">
        <h2 className="font-semibold text-lg">
          {format(month, 'MMMM')}
        </h2>
        <div className="ml-2">
            <Select value={String(selectedYear)} onValueChange={handleYearChange}>
                <SelectTrigger className="w-28 focus:ring-0">
                    <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                    {YEARS.map(year => (
                        <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>
  )

  return (
    <>
      <style>{`
        .day-present { background-color: hsl(var(--success) / 0.8); color: hsl(var(--success-foreground)); }
        .day-absent { background-color: hsl(var(--destructive) / 0.8); color: hsl(var(--destructive-foreground)); }
        .day-halfDay { background-color: hsl(var(--warning) / 0.8); color: hsl(var(--warning-foreground)); }
        .day-onLeave { background-color: hsl(var(--primary) / 0.8); color: hsl(var(--primary-foreground)); }
        .day-holiday { background-color: hsl(var(--accent)); color: hsl(var(--accent-foreground)); border: 1px solid hsl(var(--border)); }
        .day-present, .day-absent, .day-halfDay, .day-onLeave, .day-holiday { border-radius: var(--radius); }
        .rdp-day_today:not(.rdp-day_outside) { font-weight: bold; border: 2px solid hsl(var(--primary)); border-radius: var(--radius); }
        .rdp { --rdp-cell-size: 40px; border-spacing: 2px; }
        .rdp-day { border: 1px solid transparent; }
        .rdp-table { border-collapse: separate; }
        .rdp-head_cell { font-weight: 500; }
        .rdp-caption_label { display: none; }
        .rdp-nav_button { border-radius: var(--radius); }
      `}</style>
      <DayPicker
        month={month}
        onMonthChange={setMonth}
        mode="single"
        components={{
          DayContent: CustomDay,
          Caption: Caption,
        }}
        modifiers={{ 
          present: presentDays, 
          absent: absentDays, 
          halfDay: halfDays, 
          onLeave: onLeaveDays,
          holiday: holidayDays
        }}
        modifiersClassNames={{
          present: 'day-present',
          absent: 'day-absent',
          halfDay: 'day-halfDay',
          onLeave: 'day-onLeave',
          holiday: 'day-holiday'
        }}
        className="w-full"
        showOutsideDays
        today={new Date()}
      />
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2"><Badge className="bg-success hover:bg-success/90 w-4 h-4 p-0" /> Present</div>
        <div className="flex items-center gap-2"><Badge className="bg-warning hover:bg-warning/90 w-4 h-4 p-0" /> Half-Day</div>
        <div className="flex items-center gap-2"><Badge className="bg-destructive hover:bg-destructive/90 w-4 h-4 p-0" /> Absent</div>
        <div className="flex items-center gap-2"><Badge className="bg-primary hover:bg-primary/90 w-4 h-4 p-0" /> On Leave</div>
        <div className="flex items-center gap-2"><Badge className="bg-accent hover:bg-accent/90 w-4 h-4 p-0 border border-border" /> Holiday</div>
      </div>
    </>
  );
}
