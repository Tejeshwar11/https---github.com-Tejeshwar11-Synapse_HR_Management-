import { redirect } from 'next/navigation';

export default function EmployeeRedirectPage() {
  // This page is now redundant. We redirect to a default employee to simulate
  // a scenario where the user lands on /employee without a specific ID.
  // In a real app, you might redirect to a user selection screen or the logged-in user's page.
  redirect('/employee/282');
}
