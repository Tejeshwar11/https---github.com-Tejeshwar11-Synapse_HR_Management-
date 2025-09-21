
"use client"

import React from "react"
import type { Employee, JobOpening } from "@/lib/types"
import { Building, Briefcase, GraduationCap, MapIcon, ChevronRight, ExternalLink, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface GrowthHubProps {
  employee: Employee
  openings: JobOpening[]
}

const getCareerPath = (role: string) => {
    if (role.includes('Senior')) {
        return [role, role.replace('Senior', 'Lead'), role.replace('Senior', 'Manager')];
    }
    if (role.includes('Associate')) {
        return [role, role.replace('Associate', 'Senior'), role.replace('Associate', 'Lead')];
    }
    if (role.includes('Junior')) {
         return [role, role.replace('Junior', 'Associate'), role.replace('Junior', 'Senior')];
    }
    return [role, 'Next Level', 'Further Level'];
}

const JobDetailsDialog = ({ job }: { job: JobOpening }) => {
    const { toast } = useToast();

    const handleApply = () => {
        toast({
            title: "Application Submitted!",
            description: `You have successfully applied for the ${job.title} position.`,
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">View Details</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{job.title}</DialogTitle>
                    <DialogDescription>
                        {job.department} • {job.location}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Job Description</h4>
                        <p className="text-sm text-muted-foreground">
                            We are looking for a talented and motivated individual to join our {job.department} team. This role will be responsible for driving key initiatives and collaborating with cross-functional teams to achieve our company goals.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Required Skills</h4>
                        <div className="flex flex-wrap gap-2">
                           {['React', 'Node.js', 'Teamwork', 'Communication'].map(skill => (
                               <Badge key={skill} variant="secondary">{skill}</Badge>
                           ))}
                        </div>
                    </div>
                </div>
                <Button onClick={handleApply} className="w-full">
                    <Sparkles className="mr-2 h-4 w-4" /> Apply Now
                </Button>
            </DialogContent>
        </Dialog>
    )
}


export function GrowthHub({ employee, openings }: GrowthHubProps) {
  const careerPath = getCareerPath(employee.role);
  
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Growth Hub</h1>
        <p className="text-muted-foreground">
          Explore your career path, develop new skills, and discover opportunities at Synapse.
        </p>
      </header>

      <Tabs defaultValue="career">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="career"><MapIcon className="mr-2 h-4 w-4" /> My Career Path</TabsTrigger>
          <TabsTrigger value="skills"><GraduationCap className="mr-2 h-4 w-4" /> Skill Development</TabsTrigger>
          <TabsTrigger value="openings"><Briefcase className="mr-2 h-4 w-4" /> Internal Openings</TabsTrigger>
        </TabsList>

        <TabsContent value="career" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Potential Career Ladder</CardTitle>
              <CardDescription>Based on your current role as a {employee.role}, here's a potential growth trajectory.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-4 md:space-x-8">
                {careerPath.map((pathRole, index) => (
                  <React.Fragment key={pathRole}>
                    <div className="flex flex-col items-center text-center">
                       <div className={`flex items-center justify-center h-24 w-24 rounded-full border-4 ${index === 0 ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}>
                         <Building className={`h-10 w-10 ${index === 0 ? 'text-primary' : 'text-muted-foreground'}`}/>
                       </div>
                       <h3 className={`mt-2 font-semibold ${index === 0 ? 'text-primary' : 'text-charcoal'}`}>{pathRole}</h3>
                       {index === 0 && <Badge className="mt-1">Current Role</Badge>}
                    </div>
                    {index < careerPath.length - 1 && (
                      <ChevronRight className="h-8 w-8 text-muted-foreground hidden md:block" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Skills</CardTitle>
                <CardDescription>Skills relevant to your role and department.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {employee.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="text-base py-1 px-3">{skill}</Badge>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Internal Training Modules</CardTitle>
                <CardDescription>Enroll in company-provided training to upskill.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 flex items-center justify-between">
                    <div>
                        <h4 className="font-semibold">Advanced {employee.department} Techniques</h4>
                        <p className="text-sm text-muted-foreground">Internal Workshop Series</p>
                    </div>
                    <Button>Enroll Now</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="openings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Internal Openings</CardTitle>
              <CardDescription>Explore roles in other departments where your skills could be a great fit.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openings.map(job => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell className="text-right">
                        <JobDetailsDialog job={job} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
