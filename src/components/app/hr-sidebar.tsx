"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  Users,
  LineChart,
  FileText,
  HeartPulse,
  Briefcase,
  GitFork,
  BrainCircuit,
  LogOut,
  ChevronLeft
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface HrSidebarProps {
    employee: {
        name: string;
        avatarUrl: string;
    }
}

const hrNav = [
  { href: "/hr", label: "Dashboard", icon: Home },
  { href: "/hr/directory", label: "Employee Directory", icon: Users },
  { href: "/hr/analytics", label: "Workforce Analytics", icon: LineChart },
  { href: "/hr/sentiment", label: "Workforce Sentiment", icon: HeartPulse },
  { href: "/hr/workflows", label: "Workflows", icon: GitFork },
  { href: "/hr/headcount", label: "Headcount Planning", icon: Briefcase },
  { href: "/hr/reports", label: "Reports", icon: FileText },
]

export function HrSidebar({ employee }: HrSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <TooltipProvider>
      <aside 
        className={cn(
            "hidden sm:flex flex-col border-r bg-background transition-[width] duration-300 ease-in-out",
            isCollapsed ? "w-14" : "w-64"
        )}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
          <div className="flex h-16 items-center border-b px-4 shrink-0">
              <Link href="/" className="flex items-center gap-2 font-bold text-charcoal overflow-hidden">
                  <BrainCircuit className="h-6 w-6 text-primary shrink-0" />
                   <AnimatePresence>
                    {!isCollapsed && (
                         <motion.span 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                         >Synapse</motion.span>
                    )}
                   </AnimatePresence>
              </Link>
          </div>
          <nav className="flex-1 space-y-1 p-2">
              {hrNav.map((item) => (
                <Tooltip key={item.label} delayDuration={0}>
                  <TooltipTrigger asChild>
                     <Link
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-gray transition-all hover:text-charcoal hover:bg-muted",
                            pathname === item.href && "bg-muted text-charcoal font-semibold",
                            "justify-start"
                        )}
                    >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <AnimatePresence>
                         {!isCollapsed && (
                            <motion.span 
                                className="overflow-hidden whitespace-nowrap"
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                            >{item.label}</motion.span>
                         )}
                        </AnimatePresence>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" sideOffset={5}>
                        {item.label}
                    </TooltipContent>
                  )}
                  </Tooltip>
              ))}
          </nav>
          <div className="mt-auto p-2 border-t">
            <div className="flex items-center gap-3 mb-2 p-2">
                <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={employee.avatarUrl} alt={employee.name} data-ai-hint="person portrait" />
                    <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                 <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div 
                            className="overflow-hidden"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                        >
                            <p className="text-sm font-semibold text-charcoal whitespace-nowrap">{employee.name}</p>
                        </motion.div>
                    )}
                 </AnimatePresence>
            </div>
             <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 shrink-0" />
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span 
                                    className="overflow-hidden whitespace-nowrap ml-3"
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.2, delay: 0.1 }}
                                >Log Out</motion.span>
                            )}
                        </AnimatePresence>
                    </Button>
                </TooltipTrigger>
                {isCollapsed && (
                    <TooltipContent side="right" sideOffset={5}>
                        Log Out
                    </TooltipContent>
                  )}
             </Tooltip>
          </div>
      </aside>
    </TooltipProvider>
  );
}
