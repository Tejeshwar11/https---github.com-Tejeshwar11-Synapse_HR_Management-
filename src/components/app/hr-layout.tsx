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
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-4 sm:px-6 sm:py-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
