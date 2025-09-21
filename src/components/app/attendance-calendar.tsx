
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
import { Badge } from "../ui/badge";

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
    present: "bg-green-100 text-green-800 hover:bg-green-200",
    absent: "bg-red-100 text-red-800 hover:bg-red-200",
    'half-day': "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    'on-leave': "bg-blue-100 text-blue-800 hover:bg-blue-200",
    holiday: "bg-gray-100 text-gray-800 hover:bg-gray-200",
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

  const CustomDay = ({ date, isOutside }: { date: Date, isOutside: boolean }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const attendanceRecord = attendanceMap.get(dateStr);
    const holidayName = holidayMap.get(dateStr);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let status: string | undefined = attendanceRecord?.status;
    let tooltipContent = null;
    let statusText: string | null = null;
    let badgeClass = "";

    if (holidayName) {
        status = 'holiday';
        statusText = holidayName.length > 10 ? holidayName.substring(0,9) + '...' : holidayName;
        tooltipContent = `Holiday: ${holidayName}`;
        badgeClass = statusStyles.holiday;
    } else if (isWeekend) {
        tooltipContent = "Weekend";
    } else if (attendanceRecord) {
        statusText = status?.replace('-', ' ') || null;
        if (status === 'present' && attendanceRecord.punchIn && attendanceRecord.punchOut) {
            tooltipContent = `Status: Present\nIn: ${attendanceRecord.punchIn}, Out: ${attendanceRecord.punchOut}`;
        } else {
            tooltipContent = `Status: ${status?.replace('-', ' ')}`;
        }
        badgeClass = status ? statusStyles[status] : "";
    } else if (date < new Date() && !isOutside) {
        status = 'absent';
        statusText = 'Absent';
        tooltipContent = `Status: Absent`;
        badgeClass = statusStyles.absent;
    }
    
    const dayContent = (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-1 group hover:bg-gray-50 transition-colors">
        <span className={cn("absolute top-1 right-1 text-xs", isOutside ? "text-muted-foreground" : "")}>{format(date, "d")}</span>
        <div className="flex-grow flex items-center justify-center w-full mt-2">
            {statusText && badgeClass && (
                <Badge variant="outline" className={cn("w-full justify-center capitalize border-none", badgeClass)}>
                  {statusText}
                </Badge>
            )}
        </div>
      </div>
    );
    
    if (tooltipContent) {
         return (
            <TooltipProvider delayDuration={0}>
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
        .rdp-day { border: 1px solid hsl(var(--border)); height: var(--rdp-cell-size); width: var(--rdp-cell-size); padding: 0; }
        .rdp-day_outside { color: hsl(var(--muted-foreground)); }
        .rdp-day_today { border: 2px solid hsl(var(--primary)); border-radius: var(--radius); }
        .rdp-table { border-collapse: separate; border-spacing: 0; }
        .rdp { --rdp-cell-size: 80px; }
        .rdp-caption_label { display: none; }
      `}</style>
      <DayPicker
        month={month}
        onMonthChange={setMonth}
        mode="single"
        components={{
          DayContent: ({ date }) => <CustomDay date={date} isOutside={false} />,
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

    

    