import { EmployeeHistory } from "@/components/app/employee-history";
import { mockPriyaSharma } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function EmployeeHistoryPage() {
  return (
    <>
        <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Tip</AlertTitle>
            <AlertDescription>
                Use the arrows and dropdown to navigate your attendance history for the past three years. Hover over any day for detailed timings.
            </AlertDescription>
        </Alert>
        <EmployeeHistory employee={mockPriyaSharma} />
    </>
    );
}
