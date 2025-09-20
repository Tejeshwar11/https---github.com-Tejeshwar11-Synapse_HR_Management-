import { EmployeeDashboard } from "@/components/app/employee-dashboard";
import { mockEmployees } from "@/lib/data";

export default function Home() {
  // In a real app, you'd fetch the logged-in user's data.
  // Here we'll just use the first mock employee.
  const employee = mockEmployees[0];

  return <EmployeeDashboard employee={employee} />;
}
