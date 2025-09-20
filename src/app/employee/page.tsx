
import { EmployeeDashboard } from "@/components/app/employee-dashboard";
import { mockPriyaSharma } from "@/lib/data";

export default function EmployeePage() {
  // In a real app, you would fetch the employee data based on the ID.
  // For this prototype, we'll use the mock data for Priya Sharma.
  return <EmployeeDashboard employee={mockPriyaSharma} />;
}
