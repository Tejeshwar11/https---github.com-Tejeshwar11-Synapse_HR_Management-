"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { Workflow } from "@/lib/types"

interface WorkflowDashboardProps {
    workflows: Workflow[];
}

export function WorkflowDashboard({ workflows }: WorkflowDashboardProps) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Onboarding & Offboarding Workflows</h1>
        <p className="text-muted-foreground">
          Track active HR workflows for new hires and departing employees.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Active Workflows</CardTitle>
          <CardDescription>Showing {workflows.length} active and recently completed workflows.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Step</TableHead>
                <TableHead className="w-[200px]">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map(wf => (
                <TableRow key={wf.id}>
                  <TableCell className="font-medium">{wf.employeeName}</TableCell>
                  <TableCell>
                    <Badge variant={wf.type === 'Onboarding' ? 'default' : 'secondary'} className={wf.type === 'Onboarding' ? 'bg-blue-500' : ''}>{wf.type}</Badge>
                  </TableCell>
                  <TableCell>
                     <Badge variant={
                        wf.status === 'Completed' ? 'default' 
                        : wf.status === 'In Progress' ? 'secondary'
                        : 'outline'
                    } className={wf.status === 'Completed' ? 'bg-success' : wf.status === 'In Progress' ? 'bg-pending text-pending-foreground': ''}>
                        {wf.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{wf.currentStep}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Progress value={wf.completion} className="h-2" />
                        <span className="text-xs font-medium">{wf.completion}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
