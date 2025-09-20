import { EmployeeDashboard } from "@/components/app/employee-dashboard";
import { mockEmployees, mockLeaveRequests } from "@/lib/data";

export default function Home() {
  // In a real app, you'd fetch the logged-in user's data.
  // Here we'll just use the first mock employee.
  const employee = mockEmployees[0];

  // Make sure the employee has the requests assigned.
  const employeeRequests = mockLeaveRequests.filter(req => req.employeeId === employee.id);
  const employeeWithRequests = { ...employee, requests: employeeRequests };


  return <EmployeeDashboard employee={employeeWithRequests} />;
}
