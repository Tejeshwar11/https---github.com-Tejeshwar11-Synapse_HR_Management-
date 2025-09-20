import { TeamCalendar } from "@/components/app/team-calendar";
import { mockEmployees } from "@/lib/data";
import { mockPriyaSharma } from "@/lib/data";

export default function TeamCalendarPage() {
  // We'll filter the employees to show only Priya's department.
  const teamMembers = mockEmployees.filter(
    (e) => e.department === mockPriyaSharma.department
  );

  return <TeamCalendar currentUser={mockPriyaSharma} teamMembers={teamMembers} />;
}
