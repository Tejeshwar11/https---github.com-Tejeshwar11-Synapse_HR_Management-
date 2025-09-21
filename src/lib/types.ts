

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
  department?: Department;
};

export type AttendanceStatus = 'present' | 'absent' | 'half-day' | 'on-leave' | 'holiday';

export type AttendanceRecord = {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  punchIn?: string; // HH:mm
  punchOut?: string; // HH:mm
  totalHours?: number;
};

export type Department = 'Engineering' | 'Sales' | 'Marketing' | 'R&D' | 'HR';
export type Skill = string;

export type Goal = {
  id: string;
  title: string;
  keyResults: {
    id: string;
    description: string;
    progress: number;
  }[];
}

export type Kudos = {
  id: string;
  from: string;
  fromAvatar: string;
  to: string;
  message: string;
  timestamp: string; // ISO 8601
}

export type Employee = {
  id: string;
  name: string;
  role: string;
  department: Department;
  avatarUrl: string;
  email: string;
  halfDays?: number;
  stats: {
    leaveBalance: {
      used: number;
      total: number;
    };
    perfectStreak: number;
    collaborationIndex: number;
  };
  requests: LeaveRequest[];
  attendance: AttendanceRecord[];
  skills: Skill[];
  goals: Goal[];
  kudos: Kudos[];
  flightRisk?: {
      score: number;
      contributingFactors: string[];
  };
};

export type HrAdmin = {
    id: string;
    name:string;
    avatarUrl: string;
}

export type JobOpening = {
  id: string;
  title: string;
  department: Department;
  location: string;
}

export type WellnessStat = {
  month: string;
  score: number;
}

export type Workflow = {
  id: string;
  type: 'Onboarding' | 'Offboarding';
  employeeName: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  currentStep: string;
  completion: number;
}

export type Holiday = {
    date: string; // YYYY-MM-DD
    name: string;
}
