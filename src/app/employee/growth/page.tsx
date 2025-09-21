import { GrowthHub } from "@/components/app/growth-hub";
import { mockPriyaSharma, mockInternalOpenings } from "@/lib/data";

export default function GrowthHubPage() {
  return <GrowthHub employee={mockPriyaSharma} openings={mockInternalOpenings} />;
}
