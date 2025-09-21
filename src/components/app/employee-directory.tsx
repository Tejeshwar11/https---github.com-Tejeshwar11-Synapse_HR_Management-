
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { format } from "date-fns";

import type { Employee } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

const DEPARTMENTS = ["All", ...departmentList];

const SKILL_COLORS = ['text-primary', 'text-slate-gray', 'text-teal-600'];

const WordCloudDialog = ({ skills, onSkillSelect }: { skills: { text: string, value: number }[], onSkillSelect: (skill: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSkillClick = (skill: string) => {
        onSkillSelect(skill);
        setIsOpen(false);
    }

    const maxCount = Math.max(...skills.map(s => s.value), 1);

    const getFontSize = (value: number) => {
        const minSize = 12; // 0.75rem
        const maxSize = 36; // 2.25rem
        const scale = (value / maxCount);
        return `${minSize + (maxSize - minSize) * scale}px`;
    }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <Button variant="outline"><Sparkles className="mr-2 h-4 w-4" /> View Skills Cloud</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
                <DialogTitle>Company Skills Cloud</DialogTitle>
            </DialogHeader>
            <div className="p-6 flex flex-wrap gap-x-4 gap-y-2 items-center justify-center">
                {skills.map((skill, index) => (
                    <button 
                        key={skill.text} 
                        onClick={() => handleSkillClick(skill.text)} 
                        className={`font-semibold transition-transform hover:scale-110 ${SKILL_COLORS[index % SKILL_COLORS.length]}`}
                        style={{ fontSize: getFontSize(skill.value) }}
                    >
                      {skill.text}
                    </button>
                ))}
            </div>
        </DialogContent>
    </Dialog>
  );
};


interface EmployeeDirectoryProps {
  employees: Employee[];
}

export function EmployeeDirectory({ employees }: EmployeeDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [isSkillsView, setIsSkillsView] = useState(false);
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const inDept = selectedDept === "All" || employee.department === selectedDept;
      
      const matchesSearch = isSkillsView 
        ? employee.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
        : (
            employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.id.includes(searchTerm)
          );

      return inDept && matchesSearch;
    });
  }, [employees, searchTerm, selectedDept, isSkillsView]);

  const skillsWordCloudData = useMemo(() => {
    const skillCounts = new Map<string, number>();
    employees.forEach(emp => {
      emp.skills.forEach(skill => {
        skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1);
      });
    });
    return Array.from(skillCounts.entries())
        .map(([text, value]) => ({ text, value }))
        .sort((a,b) => b.value - a.value)
        .slice(0, 30); // Top 30 skills
  }, [employees]);

  const handleSkillSelect = (skill: string) => {
    setIsSkillsView(true);
    setSearchTerm(skill);
  }

  return (
    <div className="space-y-6">
       <header className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">Employee Directory</h1>
                <p className="text-muted-foreground">Browse, search, and manage all employee profiles.</p>
            </div>
            <div className="flex items-center space-x-2">
                <Label htmlFor="skills-view" className="text-sm font-medium">Skills View</Label>
                <Switch 
                    id="skills-view" 
                    checked={isSkillsView} 
                    onCheckedChange={setIsSkillsView}
                />
            </div>
       </header>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={isSkillsView ? "Search by skill..." : "Search by name, email, or ID..."}
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
               <div className="flex gap-2">
                <WordCloudDialog skills={skillsWordCloudData} onSkillSelect={handleSkillSelect} />
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
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-22rem)]">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[280px]">Name</TableHead>
                  <TableHead>{isSkillsView ? 'Top Skills' : 'Department'}</TableHead>
                  <TableHead>Role</TableHead>
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
                      <TableCell>
                        {isSkillsView ? (
                            <div className="flex flex-wrap gap-1">
                                {emp.skills.slice(0,3).map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                            </div>
                        ) : emp.department}
                      </TableCell>
                      <TableCell className="text-slate-gray">{emp.role}</TableCell>
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

    