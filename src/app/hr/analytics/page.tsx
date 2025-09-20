import { HrAnalyticsDashboard } from "@/components/app/hr-analytics";
import { mockEmployees } from "@/lib/data";

export default function HrAnalyticsPage() {
  return <HrAnalyticsDashboard employees={mockEmployees} />;
}
