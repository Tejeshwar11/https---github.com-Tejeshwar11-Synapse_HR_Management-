import { GrowthHub } from "@/components/app/growth-hub";
import { mockEmployees, mockInternalOpenings } from "@/lib/data";
import { notFound } from "next/navigation";

export default function GrowthHubPage({ params }: { params: { id: string } }) {
  const employee = mockEmployees.find((e) => e.id === params.id);

  if (!employee) {
    return notFound();
  }
  
  return <GrowthHub employee={employee} openings={mockInternalOpenings} />;
}
