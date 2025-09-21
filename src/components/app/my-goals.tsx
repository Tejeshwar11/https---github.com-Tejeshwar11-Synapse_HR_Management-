"use client"

import type { Employee, Goal } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target } from "lucide-react"

interface MyGoalsProps {
  employee: Employee
}

function KeyResult({ kr }: { kr: Goal['keyResults'][0] }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-gray">{kr.description}</p>
        <p className="text-sm font-medium text-charcoal">{kr.progress}%</p>
      </div>
      <Progress value={kr.progress} className="h-2" />
    </div>
  )
}

function ObjectiveCard({ goal }: { goal: Goal }) {
  const totalProgress = goal.keyResults.reduce((acc, kr) => acc + kr.progress, 0)
  const averageProgress = Math.round(totalProgress / goal.keyResults.length)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {goal.title}
            </CardTitle>
            <CardDescription>Objective for this quarter</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-charcoal">{averageProgress}%</p>
            <p className="text-xs text-muted-foreground">Overall Progress</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {goal.keyResults.map(kr => (
          <KeyResult key={kr.id} kr={kr} />
        ))}
      </CardContent>
    </Card>
  )
}

export function MyGoals({ employee }: MyGoalsProps) {
  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">My Goals (OKRs)</h1>
        <p className="text-muted-foreground">
          Track your progress against your quarterly objectives and key results.
        </p>
      </header>

      <div className="space-y-6">
        {employee.goals.map(goal => (
          <ObjectiveCard key={goal.id} goal={goal} />
        ))}
         {employee.goals.length === 0 && (
            <Card className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">You don't have any goals assigned for this quarter.</p>
            </Card>
        )}
      </div>
    </div>
  )
}
