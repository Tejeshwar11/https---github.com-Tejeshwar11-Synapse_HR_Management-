
"use client";

import React, { useState, useMemo } from "react";
import { DayPicker, Matcher } from "react-day-picker";
import type { AttendanceRecord } from "@/lib/types";
import { format, parseISO, getMonth, getYear, setMonth, setYear } from "date-fns";
import { holidayMap } from "@/lib/holidays";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttendanceCalendarProps {
  attendance: AttendanceRecord[];
  initialYear?: number;
  initialMonth?: number;
}

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 3 }, (_, i) => currentYear - i);
const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const statusStyles: Record<string, string> = {
    present: "bg-green-500",
    absent: "bg-red-500",
    'half-day': "bg-yellow-500",
    'on-leave': "bg-blue-500",
    holiday: "bg-gray-400",
};

export function AttendanceCalendar({ attendance, initialYear = currentYear, initialMonth = new Date().getMonth() }: AttendanceCalendarProps) {
  const [month, setMonth] = useState<Date>(new Date(initialYear, initialMonth));
  
  const attendanceMap = useMemo(() => 
    new Map(attendance.map(a => [a.date, a])), 
  [attendance]);

  const handleYearChange = (year: string) => {
    const newYear = parseInt(year, 10);
    setMonth(current => setYear(current, newYear));
  };

  const handleMonthChange = (monthIndex: string) => {
      setMonth(current => setMonth(current, parseInt(monthIndex, 10)));
  }

  const handleNav = (direction: 'prev' | 'next') => {
      setMonth(current => new Date(current.getFullYear(), current.getMonth() + (direction === 'prev' ? -1 : 1), 1));
  }

  const CustomDay = ({ date }: { date: Date }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const attendanceRecord = attendanceMap.get(dateStr);
    const holidayName = holidayMap.get(dateStr);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let status = attendanceRecord?.status;
    let tooltipContent = null;
    let dotClass = "";

    if (holidayName) {
        status = 'holiday';
        tooltipContent = `Holiday: ${holidayName}`;
        dotClass = statusStyles.holiday;
    } else if (isWeekend) {
        tooltipContent = "Weekend";
    } else if (attendanceRecord) {
        if (status === 'present' && attendanceRecord.punchIn && attendanceRecord.punchOut) {
            tooltipContent = `Status: Present\nIn: ${attendanceRecord.punchIn}, Out: ${attendanceRecord.punchOut}`;
        } else {
            tooltipContent = `Status: ${status?.replace('-', ' ')}`;
        }
        dotClass = status ? statusStyles[status] : "";
    } else if (date < new Date()) {
        status = 'absent'; // Assume absent if no record for a past weekday
        tooltipContent = `Status: Absent`;
        dotClass = statusStyles.absent;
    }

    const dayContent = (
      <div className="relative w-full h-full flex flex-col items-end p-1">
        <span className="text-xs">{format(date, "d")}</span>
        {dotClass && <div className={cn("absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full", dotClass)}></div>}
      </div>
    );
    
    if (tooltipContent) {
         return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>{dayContent}</TooltipTrigger>
                    <TooltipContent className="whitespace-pre-line">
                        {tooltipContent}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }
    return dayContent;
  };

  const Caption = () => (
     <div className="flex justify-between items-center relative w-full px-1 mb-4">
        <div>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleNav('prev')}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 ml-2" onClick={() => handleNav('next')}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
        <div className="flex items-center gap-2">
            <Select value={String(getMonth(month))} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-36 focus:ring-0">
                    <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                    {MONTHS.map((m, i) => (
                        <SelectItem key={m} value={String(i)}>{m}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={String(getYear(month))} onValueChange={handleYearChange}>
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
        .rdp-table, .rdp-month, .rdp-vhidden { width: 100%; }
        .rdp-head_cell { font-weight: 500; color: hsl(var(--muted-foreground)); text-transform: uppercase; font-size: 0.75rem; }
        .rdp-day { border: 1px solid hsl(var(--border)); height: var(--rdp-cell-size); width: var(--rdp-cell-size); }
        .rdp-day_outside { color: hsl(var(--muted-foreground)); }
        .rdp-day_today { border: 2px solid hsl(var(--primary)); border-radius: var(--radius); }
        .rdp-table { border-collapse: collapse; }
        .rdp { --rdp-cell-size: 60px; }
        .rdp-caption_label { display: none; }
      `}</style>
      <DayPicker
        month={month}
        onMonthChange={setMonth}
        mode="single"
        components={{
          DayContent: CustomDay,
          Caption: Caption,
        }}
        className="w-full"
        showOutsideDays
        today={new Date()}
      />
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground justify-center">
        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-green-500"></span> Present</div>
        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-yellow-500"></span> Half-Day</div>
        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-red-500"></span> Absent</div>
        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span> On Leave</div>
        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-gray-400"></span> Holiday</div>
      </div>
    </>
  );
}

    