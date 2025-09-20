"use client"

import React from 'react'
import { Download, Calendar as CalendarIcon, Users, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import type { Employee } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

interface HrReportsDashboardProps {
  employees: Employee[]
}

export function HrReportsDashboard({ employees }: HrReportsDashboardProps) {
  const [date, setDate] = React.useState<DateRange | undefined>()
  const { toast } = useToast()

  const handleDownload = (reportName: string) => {
    toast({
      title: 'Report Generation Started',
      description: `${reportName} is being generated and will download shortly.`,
    })
    // In a real app, this would trigger a download.
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Report Center</h1>
        <p className="text-muted-foreground">
          Generate and download custom reports for your organization.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Custom Date Range</CardTitle>
          <CardDescription>
            Select a date range below to filter the reports. The range applies to all reports on this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={'outline'}
                className={cn(
                  'w-[300px] justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(date.from, 'LLL dd, y')
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
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-md">
                    <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Monthly Attendance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">
              A detailed report of daily attendance statuses (Present, Absent, On Leave) for all employees within the selected date range.
            </p>
          </CardContent>
          <CardContent>
            <Button className="w-full" onClick={() => handleDownload('Monthly Attendance Report')}>
              <Download className="mr-2 h-4 w-4" /> Download Report
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-md">
                    <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Leave Balance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">
              A summary of used and remaining leave balances for every employee. Includes breakdowns by leave type.
            </p>
          </CardContent>
           <CardContent>
            <Button className="w-full" onClick={() => handleDownload('Leave Balance Report')}>
              <Download className="mr-2 h-4 w-4" /> Download Report
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
             <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-md">
                    <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Employee Data Export</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">
              Export a full CSV of all employee information, including contact details, department, role, and current status.
            </p>
          </CardContent>
          <CardContent>
            <Button className="w-full" onClick={() => handleDownload('Employee Data Export')}>
              <Download className="mr-2 h-4 w-4" /> Download CSV
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
