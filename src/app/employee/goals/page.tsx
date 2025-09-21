import { MyGoals } from "@/components/app/my-goals";
import { mockPriyaSharma } from "@/lib/data";

export default function MyGoalsPage() {
  return <MyGoals employee={mockPriyaSharma} />;
}
