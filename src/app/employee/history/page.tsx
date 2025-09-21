import { EmployeeHistory } from "@/components/app/employee-history";
import { mockEmployees } from "@/lib/data";
import { notFound } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function EmployeeHistoryPage() {
  const employee = mockEmployees.find((e) => e.id === "282");

  if (!employee) {
    return notFound();
  }

  return (
    <>
        <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Tip</AlertTitle>
            <AlertDescription>
                Use the arrows and dropdown to navigate your attendance history for the past three years. Hover over any day for detailed timings.
            </AlertDescription>
        </Alert>
        <EmployeeHistory employee={employee} />
    </>
    );
}
