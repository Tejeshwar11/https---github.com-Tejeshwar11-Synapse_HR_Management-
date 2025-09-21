"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Employee } from "@/lib/types";
import { AttendanceCalendar } from "./attendance-calendar";

interface EmployeeHistoryProps {
    employee: Employee;
}

export function EmployeeHistory({ employee }: EmployeeHistoryProps) {
    return (
        <div>
            <header className="mb-6">
                <h1 className="text-3xl font-bold">My Attendance History</h1>
                <p className="text-muted-foreground">A detailed view of your attendance for the last 3 years.</p>
            </header>
            <Card>
                <CardHeader>
                    <CardTitle>Attendance Calendar</CardTitle>
                    <CardDescription>
                        Here is a log of your daily status. Use the controls to navigate through years and months.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center">
                      <AttendanceCalendar attendance={employee.attendance} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
