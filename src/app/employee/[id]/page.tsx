import { EmployeeDashboard } from "@/components/app/employee-dashboard";
import { mockEmployees } from "@/lib/data";
import { notFound } from "next/navigation";

export default function EmployeePage({ params }: { params: { id: string } }) {
  const employee = mockEmployees.find((e) => e.id === params.id);

  if (!employee) {
    return notFound();
  }
  
  return <EmployeeDashboard employee={employee} />;
}
