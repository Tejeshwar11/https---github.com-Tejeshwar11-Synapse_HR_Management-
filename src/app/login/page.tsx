"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrainCircuit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [employeeId, setEmployeeId] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (employeeId === '734') { // Priya Sharma
            router.push('/employee');
        } else if (employeeId === '801') { // Fatima Al-Jamil
            router.push('/hr');
        } else if (employeeId === '123') { // David Chen
            router.push('/employee/123'); // Example of another employee
        } else {
           toast({
               variant: "destructive",
               title: "Login Failed",
               description: "Invalid Employee ID. Please use 734 (Employee), 801 (HR), or 123 (Employee for Profile View).",
           });
        }
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-off-white">
       <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'url(/abstract-nodes.svg)', backgroundSize: 'cover' }}></div>
      <Card className="w-full max-w-sm z-10 shadow-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <BrainCircuit className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">Synapse</CardTitle>
          <CardDescription>Sign in to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input 
                id="employeeId" 
                type="text" 
                placeholder="e.g., 734" 
                required 
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required defaultValue="password" />
            </div>
            <Button type="submit" className="w-full transition-transform hover:scale-105">
              Sign In Securely
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
