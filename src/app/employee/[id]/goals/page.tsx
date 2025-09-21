import { MyGoals } from "@/components/app/my-goals";
import { mockEmployees } from "@/lib/data";
import { notFound } from "next/navigation";

export default function MyGoalsPage({ params }: { params: { id: string } }) {
  const employee = mockEmployees.find((e) => e.id === params.id);

  if (!employee) {
    return notFound();
  }

  return <MyGoals employee={employee} />;
}
