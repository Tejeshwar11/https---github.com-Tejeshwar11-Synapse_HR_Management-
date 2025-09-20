import { AppSidebar } from "@/components/app/app-sidebar";
import { mockFatimaAlJamil } from "@/lib/data";

export default function HrLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar userRole="hr" employee={mockFatimaAlJamil} />
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-4 sm:px-6 sm:py-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
