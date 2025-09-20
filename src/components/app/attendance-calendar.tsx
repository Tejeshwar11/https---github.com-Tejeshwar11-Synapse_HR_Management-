"use client";

import React from "react";
import { DayPicker, Matcher } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import type { AttendanceRecord } from "@/lib/types";
import { parseISO } from "date-fns";

interface AttendanceCalendarProps {
  attendance: AttendanceRecord[];
  months?: number;
}

export function AttendanceCalendar({ attendance, months = 1 }: AttendanceCalendarProps) {
  const presentDays: Matcher[] = attendance
    .filter((a) => a.status === 'present')
    .map((a) => parseISO(a.date));

  const absentDays: Matcher[] = attendance
    .filter((a) => a.status === 'absent')
    .map((a) => parseISO(a.date));

  const halfDays: Matcher[] = attendance
    .filter((a) => a.status === 'half-day')
    .map((a) => parseISO(a.date));
    
  const onLeaveDays: Matcher[] = attendance
    .filter((a) => a.status === 'on-leave')
    .map((a) => parseISO(a.date));

  return (
    <>
      <style>{`
        .day-present { background-color: hsl(var(--success) / 0.8); color: hsl(var(--success-foreground)); }
        .day-absent { background-color: hsl(var(--destructive) / 0.8); color: hsl(var(--destructive-foreground)); }
        .day-halfDay { background-color: hsl(var(--warning) / 0.8); color: hsl(var(--warning-foreground)); }
        .day-onLeave { background-color: hsl(var(--primary) / 0.8); color: hsl(var(--primary-foreground)); }
        .day-present, .day-absent, .day-halfDay, .day-onLeave { border-radius: var(--radius); }
        .rdp-day_today:not(.rdp-day_outside) { font-weight: bold; border: 2px solid hsl(var(--primary)); border-radius: var(--radius); }
        .rdp { --rdp-cell-size: 40px; border-spacing: 2px; }
        .rdp-day { border: 1px solid transparent; }
        .rdp-table { border-collapse: separate; }
        .rdp-head_cell { font-weight: 500; }
        .rdp-caption_label { font-size: 1.1rem; font-weight: 600; }
        .rdp-nav_button { border-radius: var(--radius); }
      `}</style>
      <DayPicker
        numberOfMonths={months}
        mode="single"
        modifiers={{ 
          present: presentDays, 
          absent: absentDays, 
          halfDay: halfDays, 
          onLeave: onLeaveDays,
        }}
        modifiersClassNames={{
          present: 'day-present',
          absent: 'day-absent',
          halfDay: 'day-halfDay',
          onLeave: 'day-onLeave',
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
      </div>
    </>
  );
}
