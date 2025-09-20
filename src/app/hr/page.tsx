import { HrDashboard } from "@/components/app/hr-dashboard";
import { hrDashboardData, mockFatimaAlJamil } from "@/lib/data";

export default function HrPage() {
  return <HrDashboard user={mockFatimaAlJamil} data={hrDashboardData} />;
}
