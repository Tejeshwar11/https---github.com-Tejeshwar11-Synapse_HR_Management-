import { WorkflowDashboard } from "@/components/app/workflow-dashboard";
import { mockWorkflows } from "@/lib/data";

export default function WorkflowsPage() {
    return <WorkflowDashboard workflows={mockWorkflows} />
}
