import type { Employee, LeaveRequest } from '@/lib/types';
import { subDays, format, addDays, getDay, subYears } from 'date-fns';

const today = new Date();

export const DEPARTMENTS = [
  'Information Technology (IT)',
  'Sales',
  'Operations / Production',
  'Engineering / Research & Development (R&D)',
  'Customer Service / Support',
  'Marketing',
  'Finance & Accounting',
  'Supply Chain & Logistics',
];

const FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Ananya', 'Diya', 'Saanvi', 'Aadhya', 'Pari', 'Riya', 'Myra', 'Aarohi', 'Isha', 'Prisha', 'Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Ava', 'Elijah', 'Charlotte', 'William', 'Sophia', 'James', 'Isabella', 'Benjamin', 'Mia', 'Lucas', 'Amelia', 'Henry', 'Harper', 'Alexander', 'Evelyn'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Lewis', 'Robinson', 'Walker'];
const PROFESSIONAL_REASONS_LEAVE = [
    "Attending a family wedding out of state.",
    "Medical appointment for a routine check-up.",
    "Scheduled home renovation and repairs.",
    "Taking a personal day for rest and relaxation.",
    "Going on a planned vacation with family.",
    "Child's school event participation.",
    "Caring for a sick family member.",
    "Government/legal appointments.",
];
const PROFESSIONAL_REASONS_REGULARIZATION = [
    "Forgot to punch in due to network issues at the entrance.",
    "System did not register my punch-out yesterday.",
    "Was working off-site for a client meeting in the morning.",
    "Had to leave early for a personal emergency, forgot to regularize.",
    "Power outage at my location caused login delays.",
];


const generateAttendance = (numDays: number): Employee['attendance'] => {
  const attendance: Employee['attendance'] = [];
  const threeYearsAgo = subYears(today, 3);
  
  for (let i = 0; i < numDays; i++) {
    const date = subDays(today, i);
    if (date < threeYearsAgo) continue;

    const dayOfWeek = getDay(date);

    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue;
    }

    let status: Employee['attendance'][0]['status'];
    const statusChance = Math.random();
    if (statusChance > 0.99) status = 'absent'; // 1% chance
    else if (statusChance > 0.97) status = 'on-leave'; // 2% chance
    else if (statusChance > 0.95) status = 'half-day'; // 2% chance
    else status = 'present'; // 95% chance

    attendance.push({
      date: format(date, 'yyyy-MM-dd'),
      status,
      punchIn: status === 'present' || status === 'half-day' ? '09:30' : undefined,
      punchOut: status === 'present' ? '18:30' : status === 'half-day' ? '14:00' : undefined,
    });
  }
   // Add today's status
  if (getDay(today) !== 0 && getDay(today) !== 6){
      const currentDayRecord = attendance.find(a => a.date === format(today, 'yyyy-MM-dd'));
      if (!currentDayRecord) {
        attendance.unshift({
            date: format(today, 'yyyy-MM-dd'),
            status: Math.random() > 0.2 ? 'present' : 'on-leave',
            punchIn: '09:25',
            punchOut: undefined
        });
      }
  }

  return attendance.sort((a, b) => b.date.localeCompare(a.date));
};

const generateEmployees = (min: number, max: number): Employee[] => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const employees: Employee[] = [];
  let departmentIndex = 0;

  for (let i = 1; i <= count; i++) {
    const id = `emp-${String(i).padStart(4, '0')}`;
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    
    // Distribute employees somewhat evenly across departments
    const department = DEPARTMENTS[departmentIndex];
    departmentIndex = (departmentIndex + 1) % DEPARTMENTS.length;
    
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@examplecorp.com`;

    employees.push({
      id,
      name: `${firstName} ${lastName}`,
      avatarUrl: `https://picsum.photos/seed/${id}/150/150`,
      email,
      department,
      usualPunchIn: '09:30',
      usualPunchOut: '18:30',
      leaveBalance: Math.floor(Math.random() * 15) + 5,
      halfDays: Math.floor(Math.random() * 5),
      attendance: generateAttendance(365 * 3), // 3 years of data
      requests: [],
    });
  }
  return employees;
};

export const mockEmployees: Employee[] = generateEmployees(800, 1000);

const generateLeaveRequests = (employees: Employee[]): LeaveRequest[] => {
    const requests: LeaveRequest[] = [];
    
    // Generate a few pending requests
    for (let i = 0; i < 15; i++) { // Increased pending requests
        const employee = employees[Math.floor(Math.random() * employees.length)];
        const isLeave = Math.random() > 0.5;
        const startDate = addDays(today, Math.floor(Math.random() * 10) + 1);
        const endDate = isLeave ? addDays(startDate, Math.floor(Math.random() * 5)) : startDate;

        requests.push({
            id: `req-pending-${i}`,
            employeeId: employee.id,
            employeeName: employee.name,
            employeeAvatar: employee.avatarUrl,
            type: isLeave ? 'leave' : 'regularization',
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: format(endDate, 'yyyy-MM-dd'),
            reason: isLeave 
                ? PROFESSIONAL_REASONS_LEAVE[Math.floor(Math.random() * PROFESSIONAL_REASONS_LEAVE.length)]
                : PROFESSIONAL_REASONS_REGULARIZATION[Math.floor(Math.random() * PROFESSIONAL_REASONS_REGULARIZATION.length)],
            status: 'pending'
        });
    }

    // Generate historical requests for employees
    employees.forEach(employee => {
        const numRequests = Math.floor(Math.random() * 5) + 1; // 1-5 requests per employee
        for (let i=0; i < numRequests; i++) {
            const isLeave = Math.random() > 0.3;
            const pastDate = subDays(today, Math.floor(Math.random() * 365 * 2));
            const startDate = pastDate;
            const endDate = isLeave ? addDays(startDate, Math.floor(Math.random() * 3)) : startDate;
            
            requests.push({
                id: `req-${employee.id}-${i}`,
                employeeId: employee.id,
                employeeName: employee.name,
                employeeAvatar: employee.avatarUrl,
                type: isLeave ? 'leave' : 'regularization',
                startDate: format(startDate, 'yyyy-MM-dd'),
                endDate: format(endDate, 'yyyy-MM-dd'),
                reason: isLeave 
                    ? PROFESSIONAL_REASONS_LEAVE[Math.floor(Math.random() * PROFESSIONAL_REASONS_LEAVE.length)]
                    : PROFESSIONAL_REASONS_REGULARIZATION[Math.floor(Math.random() * PROFESSIONAL_REASONS_REGULARIZATION.length)],
                status: Math.random() > 0.1 ? 'approved' : 'rejected'
            });
        }
    });

    return requests;
};


export const mockLeaveRequests: LeaveRequest[] = generateLeaveRequests(mockEmployees);

// Add requests to employees
mockLeaveRequests.forEach(req => {
  const employee = mockEmployees.find(e => e.id === req.employeeId);
  if (employee) {
    if (!employee.requests) {
        employee.requests = [];
    }
    employee.requests.push(req);
    employee.requests.sort((a, b) => b.startDate.localeCompare(a.startDate));
  }
});
