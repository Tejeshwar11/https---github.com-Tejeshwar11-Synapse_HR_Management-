import { SentimentDashboard } from "@/components/app/sentiment-dashboard";
import { mockWellnessData } from "@/lib/data";

export default function SentimentPage() {
    return <SentimentDashboard wellnessData={mockWellnessData} />
}
