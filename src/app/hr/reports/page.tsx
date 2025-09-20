import { HrReportsDashboard } from "@/components/app/hr-reports";
import { mockEmployees } from "@/lib/data";

export default function HrReportsPage() {
  return <HrReportsDashboard employees={mockEmployees} />;
}
