import type { Employee, LeaveRequest } from '@/lib/types';
import { subDays, format, addDays, getDay } from 'date-fns';

const today = new Date();

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'Finance', 'Logistics', 'Human Resources', 'Design'];
const FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Ananya', 'Diya', 'Saanvi', 'Aadhya', 'Pari', 'Riya', 'Myra', 'Aarohi', 'Isha', 'Prisha'];
const LAST_NAMES = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Shah', 'Mehta', 'Jain', 'Reddy', 'Rao', 'Yadav', 'Malhotra', 'Kapoor', 'Chopra'];

const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateAttendance = (numDays: number): Employee['attendance'] => {
  const attendance: Employee['attendance'] = [];
  for (let i = 1; i <= numDays; i++) {
    const date = subDays(today, i);
    const dayOfWeek = getDay(date); // Sunday is 0, Saturday is 6

    let status: Employee['attendance'][0]['status'];

    // Mark weekends as 'on-leave' (or could be another category)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Skipping weekends for a cleaner calendar view
      continue;
    }

    const statusChance = Math.random();
    if (statusChance > 0.98) status = 'absent'; // Lower chance of being absent
    else if (statusChance > 0.95) status = 'on-leave';
    else if (statusChance > 0.92) status = 'half-day';
    else status = 'present';


    attendance.push({
      date: format(date, 'yyyy-MM-dd'),
      status,
      punchIn: status === 'present' || status === 'half-day' ? '09:30' : undefined,
      punchOut: status === 'present' ? '18:30' : status === 'half-day' ? '14:00' : undefined,
    });
  }
  // Add today's attendance
  attendance.unshift({
      date: format(today, 'yyyy-MM-dd'),
      status: 'present',
      punchIn: '09:25',
      punchOut: undefined
  });

  return attendance;
};

const generateEmployees = (count: number): Employee[] => {
  const employees: Employee[] = [];
  for (let i = 1; i <= count; i++) {
    const id = `emp-${String(i).padStart(3, '0')}`;
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const department = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];

    employees.push({
      id,
      name: `${firstName} ${lastName}`,
      avatarUrl: `https://picsum.photos/seed/${id}/150/150`,
      department,
      usualPunchIn: '09:30',
      usualPunchOut: '18:30',
      leaveBalance: Math.floor(Math.random() * 15) + 1,
      halfDays: Math.floor(Math.random() * 4),
      attendance: generateAttendance(365), // 1 year of data
      requests: [],
    });
  }
  return employees;
};

export const mockEmployees: Employee[] = generateEmployees(50);

export const mockLeaveRequests: LeaveRequest[] = [
    {
        id: 'req-001',
        employeeId: mockEmployees[1].id,
        employeeName: mockEmployees[1].name,
        employeeAvatar: mockEmployees[1].avatarUrl,
        type: 'leave',
        startDate: format(subDays(today, 2), 'yyyy-MM-dd'),
        endDate: format(subDays(today, 2), 'yyyy-MM-dd'),
        reason: 'Personal emergency.',
        status: 'approved'
    },
    {
        id: 'req-002',
        employeeId: mockEmployees[0].id,
        employeeName: mockEmployees[0].name,
        employeeAvatar: mockEmployees[0].avatarUrl,
        type: 'regularization',
        startDate: format(subDays(today, 4), 'yyyy-MM-dd'),
        endDate: format(subDays(today, 4), 'yyyy-MM-dd'),
        reason: 'Forgot to punch in, was working from 9:30 AM.',
        status: 'pending'
    },
    {
        id: 'req-003',
        employeeId: mockEmployees[2].id,
        employeeName: mockEmployees[2].name,
        employeeAvatar: mockEmployees[2].avatarUrl,
        type: 'leave',
        startDate: format(addDays(today, 1), 'yyyy-MM-dd'),
        endDate: format(addDays(today, 3), 'yyyy-MM-dd'),
        reason: 'Family vacation.',
        status: 'pending'
    },
    {
        id: 'req-004',
        employeeId: mockEmployees[15].id,
        employeeName: mockEmployees[15].name,
        employeeAvatar: mockEmployees[15].avatarUrl,
        type: 'leave',
        startDate: format(addDays(today, 2), 'yyyy-MM-dd'),
        endDate: format(addDays(today, 5), 'yyyy-MM-dd'),
        reason: 'Going on a trip to the mountains.',
        status: 'pending'
    },
    {
        id: 'req-005',
        employeeId: mockEmployees[45].id,
        employeeName: mockEmployees[45].name,
        employeeAvatar: mockEmployees[45].avatarUrl,
        type: 'regularization',
        startDate: format(subDays(today, 1), 'yyyy-MM-dd'),
        endDate: format(subDays(today, 1), 'yyyy-MM-dd'),
        reason: 'System issue with punch-in.',
        status: 'pending'
    }
];

// Add requests to employees
mockLeaveRequests.forEach(req => {
  const employee = mockEmployees.find(e => e.id === req.employeeId);
  if (employee) {
    employee.requests.push(req);
  }
});
