import { HrSidebar } from "@/components/app/hr-sidebar";
import { mockFatimaAlJamil } from "@/lib/data";

export default function HrLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <HrSidebar employee={mockFatimaAlJamil} />
      <div className="flex flex-col flex-1 sm:pl-14">
        {children}
      </div>
    </div>
  );
}
