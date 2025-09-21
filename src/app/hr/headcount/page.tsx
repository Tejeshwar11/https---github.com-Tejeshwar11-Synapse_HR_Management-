import { HeadcountDashboard } from "@/components/app/headcount-dashboard";
import { mockEmployees } from "@/lib/data";

export default function HeadcountPage() {
    const highRiskCount = mockEmployees.filter(e => e.flightRisk && e.flightRisk.score > 70).length;
    return <HeadcountDashboard currentHeadcount={mockEmployees.length} attritionRiskCount={highRiskCount} />
}
