import { MyGoals } from "@/components/app/my-goals";
import { mockEmployees } from "@/lib/data";
import { notFound } from "next/navigation";

export default function MyGoalsPage() {
  const employee = mockEmployees.find((e) => e.id === "282");

  if (!employee) {
    return notFound();
  }

  return <MyGoals employee={employee} />;
}
