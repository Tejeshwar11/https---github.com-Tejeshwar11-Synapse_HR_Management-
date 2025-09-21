import { EmployeeDashboard } from "@/components/app/employee-dashboard";
import { mockEmployees } from "@/lib/data";
import { notFound } from "next/navigation";

export default function EmployeePage() {
  // In a real app, you'd get the authenticated user from a session or context.
  // For this prototype, we'll use a default employee.
  const employee = mockEmployees.find((e) => e.id === "282");

  if (!employee) {
    return notFound();
  }
  
  return <EmployeeDashboard employee={employee} />;
}
