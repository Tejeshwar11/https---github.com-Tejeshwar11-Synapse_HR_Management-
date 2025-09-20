import { DetailedEmployeeProfile } from "@/components/app/detailed-employee-profile";
import { mockDavidChen } from "@/lib/data";

export default function DetailedEmployeePage() {
  // In a real app, you would fetch the employee data based on the ID from the URL.
  // For this prototype, we'll use the mock data for David Chen.
  return <DetailedEmployeeProfile employee={mockDavidChen} />;
}
