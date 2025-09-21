"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  Clock,
  Calendar,
  LogOut,
  BrainCircuit,
  Users,
  LineChart,
  FileText,
  TrendingUp,
  Award,
  Target,
  HeartPulse,
  Briefcase,
  CandlestickChart,
  GitFork,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface AppSidebarProps {
    userRole: 'employee' | 'hr';
    employee: {
        name: string;
        avatarUrl: string;
    }
}

export function AppSidebar({ userRole, employee }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  const employeeNav = [
    { href: "/employee", label: "Dashboard", icon: Home },
    { href: "/employee/history", label: "My History", icon: Clock },
    { href: "/employee/goals", label: "My Goals (OKRs)", icon: Target },
    { href: "/employee/growth", label: "Growth Hub", icon: TrendingUp },
    { href: "/employee/kudos", label: "Kudos Wall", icon: Award },
    { href: "/employee/team", label: "Team Calendar", icon: Calendar },
  ]

  const hrNav = [
    { href: "/hr", label: "Dashboard", icon: Home },
    { href: "/hr/directory", label: "Employee Directory", icon: Users },
    { href: "/hr/analytics", label: "Workforce Analytics", icon: LineChart },
    { href: "/hr/sentiment", label: "Workforce Sentiment", icon: HeartPulse },
    { href: "/hr/workflows", label: "Workflows", icon: GitFork },
    { href: "/hr/headcount", label: "Headcount Planning", icon: Briefcase },
    { href: "/hr/reports", label: "Reports", icon: FileText },
  ]

  const navItems = userRole === 'employee' ? employeeNav : hrNav;

  return (
      <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
          <div className="flex h-16 items-center border-b px-6">
              <Link href="/" className="flex items-center gap-2 font-bold text-charcoal">
                  <BrainCircuit className="h-6 w-6 text-primary" />
                  <span>Synapse</span>
              </Link>
          </div>
          <nav className="flex-1 space-y-1 p-4">
              {navItems.map((item) => (
                  <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-gray transition-all hover:text-charcoal hover:bg-muted",
                          pathname === item.href && "bg-muted text-charcoal font-semibold"
                      )}
                  >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                  </Link>
              ))}
          </nav>
          <div className="mt-auto p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={employee.avatarUrl} alt={employee.name} data-ai-hint="person portrait" />
                    <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-semibold text-charcoal">{employee.name}</p>
                </div>
            </div>
            <Button variant="ghost" className="w-full justify-start text-slate-gray" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
          </div>
      </aside>
  );
}
