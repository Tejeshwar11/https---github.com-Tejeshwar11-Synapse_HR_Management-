import { HrDashboard } from "@/components/app/hr-dashboard";
import { hrDashboardData } from "@/lib/data";

export default function HrPage() {
  return <HrDashboard data={hrDashboardData} />;
}
