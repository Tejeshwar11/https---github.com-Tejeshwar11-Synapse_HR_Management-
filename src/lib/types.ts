export type RequestType = 'leave' | 'regularization';

export type RequestStatus = 'Approved' | 'Pending' | 'Rejected';

export type LeaveRequest = {
  id: string;
  type: RequestType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: RequestStatus;
  reason?: string; // Optional reason
  employeeId?: string;
  employeeName?: string;
  employeeAvatar?: string;
};

export type AttendanceStatus = 'present' | 'absent' | 'half-day' | 'on-leave';

export type AttendanceRecord = {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
};

export type Employee = {
  id: string;
  name: string;
  role: string;
  department: string;
  avatarUrl: string;
  email: string;
  stats: {
    leaveBalance: {
      used: number;
      total: number;
    };
    perfectStreak: number;
    collaborationIndex: number;
  };
  requests: LeaveRequest[];
  flightRisk?: {
      score: number;
      contributingFactors: string[];
  };
  presence?: {
      status: 'In Office' | 'Remote' | 'On Leave';
      location?: string;
  };
  analytics?: {
    presenceHeatmapUrl: string;
  };
  attendance: AttendanceRecord[];
};

export type HrAdmin = {
    id: string;
    name: string;
    avatarUrl: string;
}
