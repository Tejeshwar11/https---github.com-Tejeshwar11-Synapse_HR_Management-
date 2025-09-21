
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
                <CardContent className="p-6">
                    <AttendanceCalendar attendance={employee.attendance} />
                </CardContent>
            </Card>
        </div>
    );
}

    