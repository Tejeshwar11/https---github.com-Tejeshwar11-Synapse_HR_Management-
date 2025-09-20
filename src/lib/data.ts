import type { Employee, LeaveRequest } from '@/lib/types';
import { subDays, format, addDays } from 'date-fns';

const today = new Date();

export const mockEmployees: Employee[] = [
  {
    id: 'emp-001',
    name: 'Alex Johnson',
    avatarUrl: 'https://picsum.photos/seed/emp-001/150/150',
    department: 'Engineering',
    usualPunchIn: '09:30',
    usualPunchOut: '18:30',
    leaveBalance: 12,
    halfDays: 1,
    attendance: [
      { date: format(subDays(today, 1), 'yyyy-MM-dd'), status: 'present', punchIn: '09:25', punchOut: '18:35' },
      { date: format(subDays(today, 2), 'yyyy-MM-dd'), status: 'present', punchIn: '09:31', punchOut: '18:29' },
      { date: format(subDays(today, 3), 'yyyy-MM-dd'), status: 'half-day', punchIn: '09:40', punchOut: '14:00' },
      { date: format(subDays(today, 4), 'yyyy-MM-dd'), status: 'absent' },
      { date: format(subDays(today, 5), 'yyyy-MM-dd'), status: 'on-leave' },
      { date: format(subDays(today, 8), 'yyyy-MM-dd'), status: 'present', punchIn: '09:28', punchOut: '18:32' },
    ],
    requests: [],
  },
  {
    id: 'emp-002',
    name: 'Maria Garcia',
    avatarUrl: 'https://picsum.photos/seed/emp-002/150/150',
    department: 'Marketing',
    usualPunchIn: '10:00',
    usualPunchOut: '19:00',
    leaveBalance: 8,
    halfDays: 0,
    attendance: [
       { date: format(subDays(today, 1), 'yyyy-MM-dd'), status: 'present', punchIn: '09:55', punchOut: '19:05' },
       { date: format(subDays(today, 2), 'yyyy-MM-dd'), status: 'on-leave' },
    ],
    requests: [],
  },
    {
    id: 'emp-003',
    name: 'James Smith',
    avatarUrl: 'https://picsum.photos/seed/emp-003/150/150',
    department: 'Design',
    usualPunchIn: '09:00',
    usualPunchOut: '18:00',
    leaveBalance: 15,
    halfDays: 2,
    attendance: [
        { date: format(subDays(today, 1), 'yyyy-MM-dd'), status: 'present', punchIn: '08:58', punchOut: '18:02' },
    ],
    requests: [],
  },
];

export const mockLeaveRequests: LeaveRequest[] = [
    {
        id: 'req-001',
        employeeId: 'emp-002',
        employeeName: 'Maria Garcia',
        employeeAvatar: 'https://picsum.photos/seed/emp-002/150/150',
        type: 'leave',
        startDate: format(subDays(today, 2), 'yyyy-MM-dd'),
        endDate: format(subDays(today, 2), 'yyyy-MM-dd'),
        reason: 'Personal emergency.',
        status: 'approved'
    },
    {
        id: 'req-002',
        employeeId: 'emp-001',
        employeeName: 'Alex Johnson',
        employeeAvatar: 'https://picsum.photos/seed/emp-001/150/150',
        type: 'regularization',
        startDate: format(subDays(today, 4), 'yyyy-MM-dd'),
        endDate: format(subDays(today, 4), 'yyyy-MM-dd'),
        reason: 'Forgot to punch in, was working from 9:30 AM.',
        status: 'pending'
    },
    {
        id: 'req-003',
        employeeId: 'emp-003',
        employeeName: 'James Smith',
        employeeAvatar: 'https://picsum.photos/seed/emp-003/150/150',
        type: 'leave',
        startDate: format(addDays(today, 1), 'yyyy-MM-dd'),
        endDate: format(addDays(today, 3), 'yyyy-MM-dd'),
        reason: 'Family vacation.',
        status: 'pending'
    }
];
