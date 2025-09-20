import { DetailedEmployeeProfile } from "@/components/app/detailed-employee-profile";
import { mockEmployees } from "@/lib/data";
import { notFound } from "next/navigation";

export default function DetailedEmployeePage({ params }: { params: { id: string } }) {
  const employee = mockEmployees.find((e) => e.id === params.id);

  if (!employee) {
    // In a real app, you'd render a proper not found page.
    return notFound();
  }

  return <DetailedEmployeeProfile employee={employee} />;
}
