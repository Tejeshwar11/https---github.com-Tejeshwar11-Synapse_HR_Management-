import { AdminDashboard } from "@/components/app/admin-dashboard";
import { mockEmployees, mockLeaveRequests } from "@/lib/data";

export default function AdminPage() {
  return <AdminDashboard employees={mockEmployees} requests={mockLeaveRequests} />;
}
