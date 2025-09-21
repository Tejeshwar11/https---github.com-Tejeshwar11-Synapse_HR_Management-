

import type { Employee, HrAdmin, LeaveRequest, AttendanceRecord, RequestStatus, Kudos, Goal, JobOpening, WellnessStat, Skill, Workflow, Department, MockUser } from '@/lib/types';
import { subDays, format, addDays, parseISO, startOfQuarter, endOfQuarter, eachDayOfInterval, subYears, getYear } from 'date-fns';
import { HOLIDAYS, holidayMap } from './holidays';

// --- DATA POOLS FOR GENERATION ---
export const DEPARTMENTS: Department[] = [
  'Engineering',
  'Sales',
  'Marketing',
  'R&D',
  'HR',
];

const FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Ananya', 'Diya', 'Saanvi', 'Aadhya', 'Pari', 'Riya', 'Myra', 'Aarohi', 'Isha', 'Prisha', 'Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Ava', 'Elijah', 'Charlotte', 'William', 'Sophia', 'James', 'Isabella', 'Benjamin', 'Mia', 'Lucas', 'Amelia', 'Henry', 'Harper', 'Alexander', 'Evelyn', 'Priya', 'David', 'Fatima', 'Chen', 'Al-Jamil', 'Sharma', 'Clark', 'Martin', 'Aamir', 'Khan', 'Wilson'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Gupta', 'Wang', 'Khan', 'Patel', 'Sharma', 'Chen', 'Clark', 'Martin'];

const ROLES_BY_DEPT: Record<Department, { Junior: string[], Associate: string[], Senior: string[], Lead: string[], Manager: string[] }> = {
    'Engineering': { Junior: ['Junior Software Engineer'], Associate: ['Software Engineer'], Senior: ['Senior Software Engineer'], Lead: ['Tech Lead'], Manager: ['Engineering Manager'] },
    'Sales': { Junior: ['Sales Development Rep'], Associate: ['Account Executive'], Senior: ['Senior Account Executive'], Lead: ['Team Lead, Sales'], Manager: ['Sales Manager'] },
    'Marketing': { Junior: ['Marketing Coordinator'], Associate: ['Marketing Associate'], Senior: ['Senior Marketing Associate'], Lead: ['Marketing Lead'], Manager: ['Marketing Manager'] },
    'R&D': { Junior: ['Research Assistant'], Associate: ['Research Scientist'], Senior: ['Senior Research Scientist'], Lead: ['Lead Scientist'], Manager: ['R&D Manager'] },
    'HR': { Junior: ['HR Coordinator'], Associate: ['HR Generalist'], Senior: ['Senior HR Business Partner'], Lead: ['HR Lead'], Manager: ['HR Manager'] },
};

const SKILLS_BY_DEPT: Record<Department, string[]> = {
  'Engineering': ['React', 'Node.js', 'Python', 'Go', 'Kubernetes', 'AWS', 'SQL', 'System Design'],
  'Sales': ['Salesforce', 'Negotiation', 'Lead Generation', 'CRM', 'Closing', 'Communication'],
  'Marketing': ['SEO', 'Content Marketing', 'Google Analytics', 'Email Marketing', 'Social Media'],
  'R&D': ['Data Analysis', 'Python', 'Machine Learning', 'Statistics', 'MATLAB', 'C++'],
  'HR': ['Recruiting', 'Employee Relations', 'Onboarding', 'Compensation', 'HRIS', 'Labor Law'],
}

const OKR_EXAMPLES: Record<Department, { objective: string, keyResults: string[] }[]> = {
    'Engineering': [
        { objective: 'Refactor authentication module', keyResults: ['Reduce latency by 20%', 'Achieve 99.9% uptime', 'Update documentation'] },
        { objective: 'Launch new feature X', keyResults: ['Complete code development', 'Pass all QA tests', 'Deploy to production'] },
    ],
    'Sales': [
        { objective: 'Exceed Q4 lead generation target by 10%', keyResults: ['Generate 150 new MQLs', 'Achieve a 20% conversion rate', 'Book 30 product demos'] },
    ],
    'Marketing': [
        { objective: 'Increase organic traffic by 15%', keyResults: ['Publish 12 new blog posts', 'Improve top 10 keyword rankings', 'Acquire 20 new backlinks'] },
    ],
    'R&D': [
        { objective: 'Validate new research hypothesis', keyResults: ['Complete literature review', 'Run 50 simulations', 'Publish findings in a preliminary report'] },
    ],
    'HR': [
        { objective: 'Improve new hire onboarding experience', keyResults: ['Reduce time-to-productivity by 10%', 'Achieve a 95% satisfaction score', 'Automate 3 manual onboarding tasks'] },
    ],
};

const FLIGHT_RISK_FACTORS = [
    '↓ Decreased time in collaboration zones',
    '↑ Increased short-notice leaves',
    '↓ Below target Collaboration Index',
    '↓ Reduced project velocity',
    '↑ Increase in after-hours work',
];

const LEAVE_REASONS = ['Family vacation', 'Medical appointment', 'Personal reasons', 'Conference attendance', 'Sick leave'];
const KUDOS_MESSAGES = [
    "for always being a team player!", "for their amazing problem-solving skills on the latest project.", "for going above and beyond to help out.", "for their incredible presentation skills.", "for being a great mentor.", "for their positive attitude and energy."
]

// --- UTILITY FUNCTIONS ---
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

const generatePunchTimes = (seed: number): { punchIn: string, punchOut: string, totalHours: number } => {
    const startHour = 8 + Math.floor(seededRandom(seed) * 2); // 8-9
    const startMinute = Math.floor(seededRandom(seed + 1) * 30); // 0-29
    const punchIn = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;

    const workDurationHours = 8 + seededRandom(seed + 2); // 8-9 hours
    const endHour = startHour + Math.floor(workDurationHours);
    const endMinute = Math.floor((startMinute + (workDurationHours % 1) * 60) % 60);
    const punchOut = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

    const totalHours = parseFloat(workDurationHours.toFixed(2));
    
    return { punchIn, punchOut, totalHours };
};


const generateAttendanceHistory = (employeeId: string): AttendanceRecord[] => {
    const history: AttendanceRecord[] = [];
    const today = new Date();
    const seed = parseInt(employeeId, 10);
    const oneYearAgo = subYears(today, 1); // REDUCED from 3 years
    
    const interval = { start: oneYearAgo, end: today };
    
    eachDayOfInterval(interval).forEach((date, i) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        
        if (holidayMap.has(dateStr)) {
            history.push({ date: dateStr, status: 'holiday' });
            return;
        }

        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) return;

        const random = seededRandom(seed + date.getDate() * (date.getMonth() + 1) + date.getFullYear());
        let status: AttendanceRecord['status'];
        let record: Partial<AttendanceRecord> = {};

        if (random < 0.94) {
            status = 'present';
            const { punchIn, punchOut, totalHours } = generatePunchTimes(seed + i);
            record = { punchIn, punchOut, totalHours };
        } else if (random < 0.98) {
            status = 'on-leave';
        } else if (random < 0.995) {
            status = 'half-day';
            const { punchIn, punchOut } = generatePunchTimes(seed + i);
            record = { punchIn, punchOut, totalHours: 4 };
        } else {
            status = 'absent';
        }
        
        history.push({ date: dateStr, status, ...record });
    });
    
    return history.sort((a, b) => b.date.localeCompare(a.date));
};


const generateLeaveRequests = (employeeId: string, attendance: AttendanceRecord[], name: string, avatar: string, department: Department): LeaveRequest[] => {
    const requests: LeaveRequest[] = [];
    const onLeaveDays = attendance.filter(a => a.status === 'on-leave');
    const seed = parseInt(employeeId, 10);
    
    for (let i = 0; i < onLeaveDays.length && i < 5; i++) { // Generate fewer requests
        if (seededRandom(seed + i * 10) > 0.5) {
            const startDate = parseISO(onLeaveDays[i].date);
            const endDate = addDays(startDate, Math.floor(seededRandom(seed + i * 20) * 3));
            
            const randomStatus = seededRandom(seed + i * 30);
            let status: RequestStatus;
            if (getYear(startDate) < getYear(new Date())) {
                status = 'Approved';
            } else {
                 if (randomStatus < 0.7) status = 'Approved';
                else if (randomStatus < 0.9) status = 'Pending';
                else status = 'Rejected';
            }
            
            requests.push({
                id: `req-${employeeId}-${i}`,
                employeeId: employeeId,
                employeeName: name,
                employeeAvatar: avatar,
                department,
                type: 'leave',
                startDate: format(startDate, 'yyyy-MM-dd'),
                endDate: format(endDate, 'yyyy-MM-dd'),
                status,
                reason: LEAVE_REASONS[Math.floor(seededRandom(seed + i * 40) * LEAVE_REASONS.length)],
            });
        }
    }
    return requests;
};

// --- MAIN DATA GENERATION ---

let allEmployees: Employee[] = [];
let currentId = 101;
const totalEmployees = 100; // REDUCED from 1000

for (let i = 0; i < totalEmployees; i++) {
    const id = `${currentId + i}`;
    const seed = parseInt(id, 10);
    
    const department = DEPARTMENTS[Math.floor(seededRandom(seed) * DEPARTMENTS.length)];
    const roleKeys = Object.keys(ROLES_BY_DEPT[department]);
    const roleCategory = roleKeys[Math.floor(seededRandom(seed+1) * roleKeys.length)] as keyof typeof ROLES_BY_DEPT[Department];
    const role = ROLES_BY_DEPT[department][roleCategory][0];

    const firstName = FIRST_NAMES[Math.floor(seededRandom(seed + 2) * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(seededRandom(seed + 3) * LAST_NAMES.length)];
    const name = `${firstName} ${lastName}`;
    const avatar = `https://picsum.photos/seed/${id}/150/150`;

    const isHighRisk = seededRandom(seed + 4) < 0.1;

    const attendance = generateAttendanceHistory(id);
    const requests = generateLeaveRequests(id, attendance, name, avatar, department);
    const usedLeave = requests.filter(r => r.status === 'Approved').length;
    const halfDays = attendance.filter(a => a.status === 'half-day').length;
    
    const employeeSkills = SKILLS_BY_DEPT[department] || [];
    const skills = [...new Set(Array.from({ length: Math.floor(seededRandom(seed+5)*3)+2 }, () => employeeSkills[Math.floor(seededRandom(Date.now()+Math.random()) * employeeSkills.length)]))];

    const okrTemplate = OKR_EXAMPLES[department][Math.floor(seededRandom(seed+6) * OKR_EXAMPLES[department].length)];
    const goals: Goal[] = [{
        id: `goal-${id}-1`,
        title: okrTemplate.objective,
        keyResults: okrTemplate.keyResults.map((kr, idx) => ({
            id: `kr-${id}-1-${idx}`,
            description: kr,
            progress: Math.floor(seededRandom(seed+7+idx) * 70) + 20,
        }))
    }];

    allEmployees.push({
        id,
        name: name,
        role,
        department,
        avatarUrl: avatar,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${id}@synapse.corp`,
        halfDays: halfDays,
        stats: {
            leaveBalance: { used: usedLeave, total: 20 },
            perfectStreak: Math.floor(seededRandom(seed + 8) * 80),
            collaborationIndex: parseFloat((seededRandom(seed + 9) * 4 + 6).toFixed(1)),
        },
        requests,
        attendance,
        skills,
        goals,
        kudos: [], // Will be populated later
        flightRisk: isHighRisk ? {
            score: Math.floor(seededRandom(seed + 10) * 30) + 70,
            contributingFactors: [...new Set(Array.from({ length: 2 }, () => FLIGHT_RISK_FACTORS[Math.floor(seededRandom(Date.now() + Math.random()) * FLIGHT_RISK_FACTORS.length)]))],
        } : undefined,
    });
}

// Generate Kudos Feed
const generatedKudos: Kudos[] = Array.from({length: 20}).map((_, i) => {
    const sender = allEmployees[Math.floor(Math.random() * totalEmployees)];
    const receiver = allEmployees[Math.floor(Math.random() * totalEmployees)];
    const message = KUDOS_MESSAGES[Math.floor(Math.random() * KUDOS_MESSAGES.length)];
    const kudosItem: Kudos = {
        id: `kudo-${Date.now()}-${i}`,
        from: sender.name,
        fromAvatar: sender.avatarUrl,
        to: receiver.name,
        message: `${receiver.name}, thank you ${message}`,
        timestamp: subDays(new Date(), Math.floor(Math.random() * 10)).toISOString(),
    };
    // Add to receiver's kudos list
    const receiverEmployee = allEmployees.find(e => e.id === receiver.id);
    if(receiverEmployee) receiverEmployee.kudos.push(kudosItem);
    return kudosItem;
});

export const mockKudos: Kudos[] = generatedKudos.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());


// Generate Internal Openings
export const mockInternalOpenings: JobOpening[] = [
    { id: 'job-1', title: 'Senior Software Engineer', department: 'Engineering', location: 'Remote' },
    { id: 'job-2', title: 'Marketing Manager', department: 'Marketing', location: 'New York' },
    { id: 'job-3', title: 'Data Scientist', department: 'R&D', location: 'San Francisco' },
    { id: 'job-4', title: 'Senior Account Executive', department: 'Sales', location: 'Remote' },
    { id: 'job-5', title: 'HR Business Partner', department: 'HR', location: 'New York' },
];

// Generate Wellness Data
export const mockWellnessData: WellnessStat[] = Array.from({length: 6}).map((_, i) => ({
    month: format(subDays(new Date(), (5-i)*30), 'MMM'),
    score: Math.floor(Math.random() * 15) + 75 - (i === 4 ? 10 : 0) // dip at the end of a quarter
}));

// Generate Workflows
export const mockWorkflows: Workflow[] = [
    { id: 'wf-1', type: 'Onboarding', employeeName: 'Sarah Lee', status: 'In Progress', currentStep: 'IT Setup', completion: 40 },
    { id: 'wf-2', type: 'Offboarding', employeeName: 'John Doe', status: 'Completed', currentStep: 'Exit Interview', completion: 100 },
    { id: 'wf-3', type: 'Onboarding', employeeName: 'Mike Chen', status: 'Pending', currentStep: 'Create Accounts', completion: 10 },
    { id: 'wf-4', type: 'Offboarding', employeeName: 'Lisa Ray', status: 'In Progress', currentStep: 'Knowledge Transfer', completion: 75 },
    { id: 'wf-5',
        type: 'Onboarding',
        employeeName: 'Tom Baker',
        status: 'In Progress',
        currentStep: 'Team Introduction',
        completion: 60
    },
];

// --- SPECIFIC MOCK USERS & AUTH ---

export const mockUsers: MockUser[] = [
    { id: '282', email: 'priya.sharma@synapse.com', password: 'SynapseEng@2025', role: 'Employee' },
    { id: '102', email: 'david.chen@synapse.com', password: 'ResearchDev!99', role: 'Employee' },
    { id: 'emp-123', email: 'aamir.khan@synapse.com', password: 'SalesLead#Q4', role: 'Employee' },
    { id: 'hr-801', email: 'fatima.clark@synapse.com', password: 'HumanRes!Lead01', role: 'HR' },
    { id: 'hr-802', email: 'isabella.martin@synapse.com', password: 'RecruitWell#25', role: 'HR' },
    { id: 'hr-803', email: 'james.wilson@synapse.com', password: 'PartnerHR@Syn', role: 'HR' },
];


const priyaSharmaData = allEmployees.find(e => e.department === 'Engineering' && e.role === 'Tech Lead') || allEmployees[0];
const priyaSharma: Employee = {
    ...priyaSharmaData,
    id: '282',
    name: 'Priya Sharma',
    role: 'Tech Lead',
    department: 'Engineering',
    avatarUrl: `https://picsum.photos/seed/282/150/150`,
    email: 'priya.sharma@synapse.corp',
};

const davidChenData = allEmployees.find(e => e.department === 'R&D' && e.flightRisk) || allEmployees[1];
const davidChen: Employee = {
    ...davidChenData,
    id: '102',
    name: 'David Chen',
    role: 'Senior Research Scientist',
    department: 'R&D',
    avatarUrl: `https://picsum.photos/seed/102/150/150`,
    email: 'david.chen@synapse.corp',
    flightRisk: {
        score: 78,
        contributingFactors: [
            '↓ Decreased time in collaboration zones',
            '↑ Increased short-notice leaves',
        ],
    },
};

const fatimaAlJamil: HrAdmin = {
    id: 'hr-801',
    name: 'Fatima Clark',
    avatarUrl: `https://picsum.photos/seed/hr-801/150/150`,
};


const findAndReplace = (employee: Employee) => {
    const index = allEmployees.findIndex(e => e.id === employee.id);
    if (index !== -1) {
        allEmployees[index] = employee;
    } else {
        allEmployees.unshift(employee);
    }
};
findAndReplace(priyaSharma);
findAndReplace(davidChen);

// --- EXPORTS ---
export const mockEmployees = allEmployees;
export const mockPriyaSharma = priyaSharma;
export const mockDavidChen = davidChen;
export const mockFatimaAlJamil = fatimaAlJamil;

const flightRiskScores = [98, 92, 85, 78, 72];
const flightRiskHotlist = mockEmployees
    .filter(e => e.flightRisk && e.flightRisk.score > 70)
    .sort((a, b) => b.flightRisk!.score - a.flightRisk!.score)
    .slice(0, 5)
    .map((e, i) => ({...e, flightRisk: {...e.flightRisk!, score: flightRiskScores[i] || 70 }}));


export const hrDashboardData = {
    workforcePulse: {
        totalPresent: 85,
        totalWorkforce: 100,
        onLeave: 6,
        highFlightRisk: mockEmployees.filter(e => e.flightRisk && e.flightRisk.score > 70).length,
        pendingApprovals: 12,
    },
    flightRiskHotlist,
    departmentCollaboration: DEPARTMENTS.map(dept => {
        const deptEmployees = allEmployees.filter(e => e.department === dept);
        const totalIndex = deptEmployees.reduce((acc, e) => acc + e.stats.collaborationIndex, 0);
        return {
            name: dept,
            collaborationIndex: parseFloat((totalIndex / (deptEmployees.length || 1)).toFixed(1)),
            target: 8.5
        }
    }),
    pendingRequests: allEmployees.flatMap(e => e.requests).filter(r => r.status === 'Pending').slice(0, 4),
    upcomingAnniversaries: allEmployees.slice(0,3).map((e, i) => ({
        name: e.name,
        date: format(addDays(new Date(), (i+1)*15), 'MMM d'),
        years: 5 - i
    }))
};
