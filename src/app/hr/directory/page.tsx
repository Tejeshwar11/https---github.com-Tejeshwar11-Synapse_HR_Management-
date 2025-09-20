import { EmployeeDirectory } from "@/components/app/employee-directory";
import { mockEmployees } from "@/lib/data";

export default function EmployeeDirectoryPage() {
  return <EmployeeDirectory employees={mockEmployees} />;
}
