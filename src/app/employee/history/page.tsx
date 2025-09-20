import { EmployeeHistory } from "@/components/app/employee-history";
import { mockPriyaSharma } from "@/lib/data";

export default function EmployeeHistoryPage() {
  // For consistency, we use the same employee data as the main dashboard.
  return <EmployeeHistory employee={mockPriyaSharma} />;
}
