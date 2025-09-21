
"use client";

import React, { useState, useMemo } from "react";
import { DayPicker, Matcher } from "react-day-picker";
import type { AttendanceRecord } from "@/lib/types";
import { format, parseISO, getMonth, getYear, setMonth, setYear, isToday, isSameMonth } from "date-fns";
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

const badgeStatusStyles: Record<string, string> = {
    absent: "bg-red-100 text-red-800 hover:bg-red-200",
    'half-day': "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    'on-leave': "bg-blue-100 text-blue-800 hover:bg-blue-200",
};

const dotStatusStyles: Record<string, string> = {
    present: "bg-green-500",
    holiday: "bg-gray-400",
}

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
    const isOutside = !isSameMonth(date, month);
    const attendanceRecord = attendanceMap.get(dateStr);
    const holidayName = holidayMap.get(dateStr);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isCurrentDay = isToday(date);

    let status: string | undefined = attendanceRecord?.status;
    let tooltipContent: React.ReactNode = null;
    let content: React.ReactNode = null;

    if (holidayName) {
        status = 'holiday';
        tooltipContent = `Holiday: ${holidayName}`;
        content = (
            <div className="flex items-center gap-1.5 text-xs px-1">
                <div className={cn("h-2 w-2 rounded-full shrink-0", dotStatusStyles[status])} />
                <span className="truncate">{holidayName}</span>
            </div>
        );
    } else if (isWeekend) {
        tooltipContent = "Weekend";
    } else if (attendanceRecord) {
        if (status === 'present') {
            tooltipContent = `Status: Present\nIn: ${attendanceRecord.punchIn}, Out: ${attendanceRecord.punchOut}`;
            content = <div className={cn("h-2 w-2 rounded-full", dotStatusStyles[status])} />;
        } else if (status) {
            tooltipContent = `Status: ${status.replace('-', ' ')}`;
            content = (
                <Badge variant="outline" className={cn("w-full justify-center capitalize border-none text-xs py-1 h-auto", badgeStatusStyles[status])}>
                  {status.replace('-', ' ')}
                </Badge>
            );
        }
    } else if (date < new Date() && !isOutside) {
        status = 'absent';
        tooltipContent = `Status: Absent`;
        content = (
            <Badge variant="outline" className={cn("w-full justify-center capitalize border-none text-xs py-1 h-auto", badgeStatusStyles[status])}>
              Absent
            </Badge>
        );
    }
    
    const dayContent = (
      <div className={cn("relative w-full h-full flex flex-col items-center justify-start p-1 group hover:bg-gray-50 transition-colors", 
        (isWeekend || isOutside) && "bg-gray-50"
      )}>
        <span className={cn(
            "self-end text-xs", 
            isOutside && "text-gray-400",
            isCurrentDay && "flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground"
        )}>{format(date, "d")}</span>
        <div className="flex-grow flex items-center justify-center w-full">
            {content}
        </div>
      </div>
    );
    
    if (tooltipContent) {
         return (
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild><div className="h-full w-full">{dayContent}</div></TooltipTrigger>
                    <TooltipContent className="whitespace-pre-line">
                        {tooltipContent}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }
    return <div className="h-full w-full">{dayContent}</div>;
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
        .rdp-day { border: 1px solid hsl(var(--border)); height: var(--rdp-cell-size); width: var(--rdp-cell-size); padding: 0; position: relative; }
        .rdp-day_outside { color: hsl(var(--muted-foreground)); }
        .rdp-table { border-collapse: separate; border-spacing: 0; }
        .rdp { --rdp-cell-size: 80px; }
        .rdp-caption_label { display: none; }
      `}</style>
      <DayPicker
        month={month}
        onMonthChange={setMonth}
        mode="single"
        components={{
          DayContent: ({ date }) => <CustomDay date={date} />,
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
