import { EmployeeSidebar } from "@/components/app/employee-sidebar";
import { mockEmployees } from "@/lib/data";
import { notFound } from "next/navigation";

export default function EmployeeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const employee = mockEmployees.find((e) => e.id === params.id);

  if (!employee) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <EmployeeSidebar employee={employee} />
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-4 sm:px-6 sm:py-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
