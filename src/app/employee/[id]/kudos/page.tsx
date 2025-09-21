import { KudosWall } from "@/components/app/kudos-wall";
import { mockKudos } from "@/lib/data";

export default function KudosWallPage() {
  return <KudosWall kudos={mockKudos} />;
}
