export type AttendanceStatus = 'present' | 'absent' | 'half-day' | 'on-leave';

export type AttendanceRecord = {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  punchIn?: string; // HH:mm
  punchOut?: string; // HH:mm
};

export type LeaveRequestType = 'leave' | 'regularization';

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export type LeaveRequest = {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  type: LeaveRequestType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason: string;
  status: RequestStatus;
};

export type Employee = {
  id: string;
  name: string;
  avatarUrl: string;
  department: string;
  usualPunchIn: string; // HH:mm
  usualPunchOut: string; // HH:mm
  leaveBalance: number;
  halfDays: number;
  attendance: AttendanceRecord[];
  requests: LeaveRequest[];
};
