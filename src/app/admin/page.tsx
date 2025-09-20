import { AdminDashboard } from "@/components/app/admin-dashboard";
import { mockEmployees } from "@/lib/data";
import type { LeaveRequest } from "@/lib/types";

// The AdminDashboard expects a separate requests array, so we'll create it from the employees' data.
const mockLeaveRequests: LeaveRequest[] = mockEmployees.flatMap(employee =>
  employee.requests.map(request => ({
    ...request,
    employeeId: employee.id,
    employeeName: employee.name,
    employeeAvatar: employee.avatarUrl
  }))
);


export default function AdminPage() {
  return <AdminDashboard employees={mockEmployees} requests={mockLeaveRequests} />;
}
