import { EmployeeSidebar } from "@/components/app/employee-sidebar";
import { mockEmployees } from "@/lib/data";
import { notFound } from "next/navigation";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In a real app, you would get the logged-in user's ID from a session or context.
  // We'll use a default ID for this prototype.
  const employee = mockEmployees.find((e) => e.id === "282");

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
