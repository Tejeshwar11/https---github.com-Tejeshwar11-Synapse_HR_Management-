import { GrowthHub } from "@/components/app/growth-hub";
import { mockEmployees, mockInternalOpenings } from "@/lib/data";
import { notFound } from "next/navigation";

export default function GrowthHubPage() {
  const employee = mockEmployees.find((e) => e.id === "282");

  if (!employee) {
    return notFound();
  }
  
  return <GrowthHub employee={employee} openings={mockInternalOpenings} />;
}
