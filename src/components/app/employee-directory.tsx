"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";

import type { Employee } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { DEPARTMENTS as departmentList } from "@/lib/data";

const DEPARTMENTS = ["All", ...departmentList];

interface EmployeeDirectoryProps {
  employees: Employee[];
}

export function EmployeeDirectory({ employees }: EmployeeDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const inDept = selectedDept === "All" || employee.department === selectedDept;
      const matchesSearch =
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.id.includes(searchTerm);
      return inDept && matchesSearch;
    });
  }, [employees, searchTerm, selectedDept]);

  return (
    <div className="space-y-6">
       <header className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">Employee Directory</h1>
                <p className="text-muted-foreground">Browse, search, and manage all employee profiles.</p>
            </div>
       </header>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name, email, or ID..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto min-w-[200px] justify-between">
                  {selectedDept === 'All' ? 'All Departments' : selectedDept}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {DEPARTMENTS.map(dept => (
                  <DropdownMenuItem key={dept} onSelect={() => setSelectedDept(dept)}>
                    {dept}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead className="w-[280px]">Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Today's Status</TableHead>
                  <TableHead className="text-right">Profile</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((emp) => {
                  const todaysAttendance = emp.attendance?.find(a => a.date === todayStr);
                  const status = todaysAttendance?.status || 'N/A';
                  return (
                    <TableRow key={emp.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={emp.avatarUrl} alt={emp.name} data-ai-hint="person portrait" />
                            <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-charcoal">{emp.name}</p>
                            <p className="text-xs text-slate-gray">{emp.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{emp.department}</TableCell>
                      <TableCell className="text-slate-gray">{emp.role}</TableCell>
                      <TableCell className="text-slate-gray">{emp.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            status === 'present' ? 'default'
                              : status === 'on-leave' ? 'outline'
                              : status === 'absent' ? 'destructive'
                              : 'secondary'
                          }
                          className={
                            status === 'present' ? 'bg-success hover:bg-success/90'
                            : status === 'absent' ? 'hover:bg-destructive/90'
                            : ''
                          }
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/employee/${emp.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
           <div className="text-xs text-muted-foreground pt-4">
                Showing {filteredEmployees.length} of {employees.length} employees.
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
