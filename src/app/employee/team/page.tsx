import { TeamCalendar } from "@/components/app/team-calendar";
import { mockEmployees } from "@/lib/data";
import { notFound } from "next/navigation";

export default function TeamCalendarPage() {
  const currentUser = mockEmployees.find((e) => e.id === "282");

  if (!currentUser) {
    return notFound();
  }

  // We'll filter the employees to show only the user's department.
  const teamMembers = mockEmployees.filter(
    (e) => e.department === currentUser.department
  );

  return <TeamCalendar currentUser={currentUser} teamMembers={teamMembers} />;
}
