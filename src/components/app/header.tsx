"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            AttendanceZen
          </Link>
          <nav className="flex items-center gap-2 bg-muted p-1 rounded-full">
            <Button
              asChild
              variant={pathname === "/" ? "default" : "ghost"}
              className={cn("font-semibold rounded-full", pathname === "/" ? "bg-background shadow-sm" : "text-muted-foreground")}
              size="sm"
            >
              <Link href="/">
                <Users className="h-4 w-4 mr-2" />
                Employee
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/admin" ? "default" : "ghost"}
              className={cn("font-semibold rounded-full", pathname === "/admin" ? "bg-background shadow-sm" : "text-muted-foreground")}
              size="sm"
            >
              <Link href="/admin">
                <Building className="h-4 w-4 mr-2" />
                HR Admin
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
