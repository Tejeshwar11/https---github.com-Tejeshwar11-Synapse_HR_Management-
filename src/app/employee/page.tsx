import { EmployeeDashboard } from "@/components/app/employee-dashboard";
import { mockPriyaSharma } from "@/lib/data";

export default function EmployeePage() {
  return <EmployeeDashboard employee={mockPriyaSharma} />;
}
