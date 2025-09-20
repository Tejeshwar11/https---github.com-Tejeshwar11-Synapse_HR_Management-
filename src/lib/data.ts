import type { Employee, HrAdmin, LeaveRequest, AttendanceRecord, RequestStatus } from '@/lib/types';
import { subDays, format, addDays, parseISO } from 'date-fns';

// --- DATA POOLS FOR GENERATION ---
export const DEPARTMENTS = [
  'Quantum Computing R&D',
  'Fusion Engineering',
  'Bio-Synth Division',
  'AI Ethics & Governance',
  'Robotics Field Operations',
  'Marketing',
  'Finance & Accounting',
];

const FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Ananya', 'Diya', 'Saanvi', 'Aadhya', 'Pari', 'Riya', 'Myra', 'Aarohi', 'Isha', 'Prisha', 'Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Ava', 'Elijah', 'Charlotte', 'William', 'Sophia', 'James', 'Isabella', 'Benjamin', 'Mia', 'Lucas', 'Amelia', 'Henry', 'Harper', 'Alexander', 'Evelyn', 'Priya', 'David', 'Fatima', 'Chen', 'Al-Jamil', 'Sharma'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Gupta', 'Wang', 'Khan', 'Patel'];

const ROLES_BY_DEPT: Record<string, string[]> = {
    'Quantum Computing R&D': ['Lead Research Scientist', 'Quantum Theorist', 'Research Associate', 'Lab Manager'],
    'Fusion Engineering': ['Lead Fusion Engineer', 'Plasma Physicist', 'Materials Scientist', 'Control Systems Engineer'],
    'Bio-Synth Division': ['Senior Geneticist', 'Bio-informatics Specialist', 'Lab Technician', 'Research Lead'],
    'AI Ethics & Governance': ['AI Ethicist', 'Policy Analyst', 'Compliance Officer', 'Data Privacy Manager'],
    'Robotics Field Operations': ['Senior Robotics Engineer', 'Field Technician', 'Drone Operator', 'Operations Lead'],
    'Marketing': ['Marketing Director', 'Content Strategist', 'Digital Marketer', 'Brand Manager'],
    'Finance & Accounting': ['Senior Accountant', 'Financial Analyst', 'Controller', 'Payroll Specialist'],
};

const FLIGHT_RISK_FACTORS = [
    '↓ Decreased time in collaboration zones',
    '↑ Increased short-notice leaves',
    '↓ Below target Collaboration Index',
    '↓ Reduced project velocity',
    '↑ Increase in after-hours work',
];

const LEAVE_REASONS = ['Family vacation', 'Medical appointment', 'Personal reasons', 'Conference attendance', 'Sick leave', 'Maternity/Paternity leave', 'Jury duty'];

// --- UTILITY FUNCTIONS ---

// Consistent random number generation based on a seed (employee ID)
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

// Generate attendance for the last 90 days, including today.
const generateAttendanceHistory = (employeeId: string): AttendanceRecord[] => {
    const history: AttendanceRecord[] = [];
    const today = new Date();
    const seed = parseInt(employeeId, 10);
    
    // Generate for the last 89 days + today (total 90 days)
    for (let i = 89; i >= 0; i--) {
        const date = subDays(today, i);
        const dayOfWeek = date.getDay();
        
        if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends

        const random = seededRandom(seed + date.getDate() * (date.getMonth() + 1));
        let status: AttendanceRecord['status'];
        
        // More realistic distribution
        if (random < 0.94) status = 'present';    // 94% chance of being present
        else if (random < 0.98) status = 'on-leave'; // 4% chance of being on leave
        else if (random < 0.995) status = 'half-day'; // 1.5% chance of half-day
        else status = 'absent';       // 0.5% chance of being absent
        
        history.push({ date: format(date, 'yyyy-MM-dd'), status });
    }
    
    return history.sort((a, b) => b.date.localeCompare(a.date));
};

// Generate some leave requests
const generateLeaveRequests = (employeeId: string, attendance: AttendanceRecord[]): LeaveRequest[] => {
    const requests: LeaveRequest[] = [];
    const onLeaveDays = attendance.filter(a => a.status === 'on-leave');
    const seed = parseInt(employeeId, 10);
    
    for (let i = 0; i < onLeaveDays.length && i < 5; i++) {
        // Don't create requests for all leaves to add realism
        if (seededRandom(seed + i * 10) > 0.5) {
            const startDate = parseISO(onLeaveDays[i].date);
            const endDate = addDays(startDate, Math.floor(seededRandom(seed + i * 20) * 3)); // 0-3 days duration
            
            const randomStatus = seededRandom(seed + i * 30);
            let status: RequestStatus;
            if (randomStatus < 0.7) status = 'Approved';
            else if (randomStatus < 0.9) status = 'Pending';
            else status = 'Rejected';
            
            requests.push({
                id: `req-${employeeId}-${i}`,
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

const deptCounts: Record<string, number> = {
    'Quantum Computing R&D': 150,
    'Fusion Engineering': 180,
    'Bio-Synth Division': 160,
    'AI Ethics & Governance': 120,
    'Robotics Field Operations': 200,
    'Marketing': 90,
    'Finance & Accounting': 100,
};

for (const dept in deptCounts) {
    const count = deptCounts[dept];
    for (let i = 0; i < count; i++) {
        const id = `${currentId + i}`;
        const seed = parseInt(id, 10);
        
        const firstName = FIRST_NAMES[Math.floor(seededRandom(seed) * FIRST_NAMES.length)];
        const lastName = LAST_NAMES[Math.floor(seededRandom(seed + 1) * LAST_NAMES.length)];
        const roles = ROLES_BY_DEPT[dept] || ['Associate'];
        const role = roles[Math.floor(seededRandom(seed + 2) * roles.length)];
        const isHighRisk = seededRandom(seed + 3) < 0.15;

        const attendance = generateAttendanceHistory(id);
        const requests = generateLeaveRequests(id, attendance);
        const usedLeave = requests.filter(r => r.status === 'Approved').length;
        const halfDays = attendance.filter(a => a.status === 'half-day').length;
        
        const todaysAttendance = attendance.find(a => a.date === format(new Date(), 'yyyy-MM-dd'));

        allEmployees.push({
            id,
            name: `${firstName} ${lastName}`,
            role,
            department: dept,
            avatarUrl: `https://picsum.photos/seed/${id}/150/150`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${id}@synapse.corp`,
            halfDays: halfDays,
            stats: {
                leaveBalance: { used: usedLeave, total: 20 },
                perfectStreak: Math.floor(seededRandom(seed + 5) * 80),
                collaborationIndex: parseFloat((seededRandom(seed + 6) * 4 + 6).toFixed(1)),
            },
            requests,
            attendance,
            flightRisk: isHighRisk ? {
                score: Math.floor(seededRandom(seed + 7) * 30) + 70,
                contributingFactors: [...new Set(Array.from({ length: Math.floor(seededRandom(seed+8) * 3) + 1 }, () => FLIGHT_RISK_FACTORS[Math.floor(seededRandom(Date.now() + Math.random()) * FLIGHT_RISK_FACTORS.length)]))],
            } : undefined,
            presence: {
                status: todaysAttendance?.status === 'on-leave' ? 'On Leave' : 'In Office',
                location: 'Engineering Wing'
            },
            analytics: {
                presenceHeatmapUrl: '/heatmap-placeholder.png'
            }
        });
    }
    currentId += count;
}

// --- SPECIFIC MOCK USERS ---

const priyaSharmaData = allEmployees.find(e => e.name.includes('Priya')) || allEmployees[0];
const priyaSharma: Employee = {
    ...priyaSharmaData,
    id: '282',
    name: 'Priya Sharma',
    role: 'Lead Fusion Engineer',
    department: 'Fusion Engineering',
    avatarUrl: `https://picsum.photos/seed/282/150/150`,
    email: 'priya.sharma@synapse.corp',
    halfDays: 2,
    stats: {
        leaveBalance: { used: 5, total: 20 },
        perfectStreak: 42,
        collaborationIndex: 7.8,
    },
    requests: [
        { id: 'req-priya-1', type: 'leave', startDate: format(subDays(new Date(), 20), 'yyyy-MM-dd'), endDate: format(subDays(new Date(), 18), 'yyyy-MM-dd'), status: 'Approved', reason: 'Family vacation' },
        { id: 'req-priya-2', type: 'regularization', startDate: format(subDays(new Date(), 45), 'yyyy-MM-dd'), endDate: format(subDays(new Date(), 45), 'yyyy-MM-dd'), status: 'Approved', reason: 'Forgot to punch in' },
        { id: 'req-priya-3', type: 'leave', startDate: format(addDays(new Date(), 10), 'yyyy-MM-dd'), endDate: format(addDays(new Date(), 15), 'yyyy-MM-dd'), status: 'Pending', reason: 'Conference' },
    ],
    attendance: generateAttendanceHistory('282'),
    presence: { status: 'In Office', location: 'Fusion Control Room' },
};

const davidChenData = allEmployees.find(e => e.name.includes('David')) || allEmployees[1];
const davidChen: Employee = {
    ...davidChenData,
    id: '102',
    name: 'David Chen',
    role: 'Lead Research Scientist',
    department: 'Quantum Computing R&D',
    avatarUrl: `https://picsum.photos/seed/102/150/150`,
    email: 'david.chen@synapse.corp',
    stats: { ...davidChenData.stats, collaborationIndex: 6.8 },
    flightRisk: {
        score: 78,
        contributingFactors: [
            '↓ Decreased time in collaboration zones',
            '↑ Increased short-notice leaves',
            '↓ Below target Collaboration Index',
        ],
    },
    attendance: generateAttendanceHistory('102'),
};

const fatimaAlJamil: HrAdmin = {
    id: 'hr-801',
    name: 'Fatima Al-Jamil',
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

const totalPendingRequests = allEmployees.reduce((acc, emp) => acc + emp.requests.filter(r => r.status === 'Pending').length, 0);
const todayStr = format(new Date(), 'yyyy-MM-dd');
const presentToday = mockEmployees.filter(e => e.attendance?.find(a => a.date === todayStr)?.status === 'present').length;
const onLeaveToday = mockEmployees.filter(e => e.attendance?.find(a => a.date === todayStr)?.status === 'on-leave').length;

export const hrDashboardData = {
    workforcePulse: {
        totalPresent: presentToday,
        totalWorkforce: mockEmployees.length,
        onLeave: onLeaveToday,
        highFlightRisk: mockEmployees.filter(e => e.flightRisk && e.flightRisk.score > 70).length,
        pendingApprovals: totalPendingRequests,
    },
    flightRiskHotlist: mockEmployees
        .filter(e => e.flightRisk && e.flightRisk.score > 70)
        .sort((a, b) => b.flightRisk!.score - a.flightRisk!.score)
        .slice(0, 5),
    departmentCollaboration: DEPARTMENTS.map(dept => {
        const deptEmployees = allEmployees.filter(e => e.department === dept);
        const totalIndex = deptEmployees.reduce((acc, e) => acc + e.stats.collaborationIndex, 0);
        return {
            name: dept,
            collaborationIndex: parseFloat((totalIndex / (deptEmployees.length || 1)).toFixed(1)),
            target: 8.5
        }
    })
};
