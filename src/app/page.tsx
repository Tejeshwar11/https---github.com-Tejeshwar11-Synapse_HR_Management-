import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, User } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center max-w-2xl mx-auto p-4">
        <div className="flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-9 w-9 text-primary"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <h1 className="text-4xl font-bold ml-3">AttendanceZen</h1>
        </div>
        <p className="text-lg text-muted-foreground mb-10">
          The intelligent, seamless, and friendly way to manage workforce attendance.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Employee Portal</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Punch in, view your attendance, and manage your leave requests.
              </CardDescription>
              <Button asChild className="w-full">
                <Link href="/login/employee">Login as Employee</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
               <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">HR Admin Portal</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Access dashboards, manage employees, and approve requests.
              </CardDescription>
              <Button asChild className="w-full">
                <Link href="/login/hr">Login as HR Admin</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
