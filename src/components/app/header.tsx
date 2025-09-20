
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building, Users, LogOut, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  userRole: 'employee' | 'admin';
}

export function AppHeader({ userRole }: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  }

  // A special role for users who can switch between views
  const isSuperUser = userRole === 'admin' && (pathname.startsWith('/admin') || pathname.startsWith('/employee'));

  return (
    <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
            <BrainCircuit className="h-6 w-6 text-primary" />
            Synapse
          </Link>
          <div className="flex items-center gap-4">
             {isSuperUser && (
                <nav className="hidden md:flex items-center gap-2 bg-muted p-1 rounded-full">
                    <Button
                    asChild
                    variant="ghost"
                    className={cn(
                        "font-semibold rounded-full", 
                        pathname.startsWith("/employee")
                        ? "bg-background shadow-sm text-foreground" 
                        : "text-muted-foreground"
                    )}
                    size="sm"
                    >
                    <Link href="/employee">
                        <Users className="h-4 w-4 mr-2" />
                        Employee
                    </Link>
                    </Button>
                    <Button
                    asChild
                    variant="ghost"
                    className={cn(
                        "font-semibold rounded-full", 
                        pathname.startsWith("/admin")
                        ? "bg-background shadow-sm text-foreground" 
                        : "text-muted-foreground"
                    )}
                    size="sm"
                    >
                    <Link href="/admin">
                        <Building className="h-4 w-4 mr-2" />
                        HR Admin
                    </Link>
                    </Button>
                </nav>
            )}
             {userRole === 'admin' && !isSuperUser && (
                 <div /> // Placeholder for non-superusers on admin-like pages if needed
             )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2"/>
                Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
