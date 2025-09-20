import type { Employee, HrAdmin, LeaveRequest } from '@/lib/types';
import { subDays, format } from 'date-fns';

export const DEPARTMENTS = [
  'Quantum Computing R&D',
  'Fusion Engineering',
  'Bio-Synth Division',
  'AI Ethics & Governance',
  'Robotics Field Operations',
  'Marketing',
  'Finance & Accounting',
];

const FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Ananya', 'Diya', 'Saanvi', 'Aadhya', 'Pari', 'Riya', 'Myra', 'Aarohi', 'Isha', 'Prisha', 'Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Ava', 'Elijah', 'Charlotte', 'William', 'Sophia', 'James', 'Isabella', 'Benjamin', 'Mia', 'Lucas', 'Amelia', 'Henry', 'Harper', 'Alexander', 'Evelyn', 'Priya', 'David', 'Fatima'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Sharma', 'Chen', 'Al-Jamil'];
const ROLES_BY_DEPT: Record<string, string[]> = {
    'Quantum Computing R&D': ['Lead Research Scientist', 'Quantum Theorist', 'Research Associate'],
    'Fusion Engineering': ['Lead Fusion Engineer', 'Plasma Physicist', 'Materials Scientist'],
    'Bio-Synth Division': ['Geneticist', 'Bio-informatics Specialist', 'Lab Technician'],
    'AI Ethics & Governance': ['AI Ethicist', 'Policy Analyst', 'Compliance Officer'],
    'Robotics Field Operations': ['Robotics Engineer', 'Field Technician', 'Drone Operator'],
    'Marketing': ['Marketing Lead', 'Content Strategist', 'Digital Marketer'],
    'Finance & Accounting': ['Accountant', 'Financial Analyst', 'Controller'],
};
const FLIGHT_RISK_FACTORS = [
    '↓ Decreased time in collaboration zones',
    '↑ Increased short-notice leaves',
    '↓ Below target Collaboration Index',
    '↓ Reduced project velocity',
    '↑ Increase in after-hours work',
];

// Helper to generate a specified number of employees for a department
const generateDeptEmployees = (count: number, department: string, startId: number): Employee[] => {
    const employees: Employee[] = [];
    for (let i = 0; i < count; i++) {
        const id = `${startId + i}`;
        const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        const roles = ROLES_BY_DEPT[department] || ['Associate'];
        const role = roles[Math.floor(Math.random() * roles.length)];
        const isHighRisk = Math.random() < 0.15; // 15% chance of being high risk

        employees.push({
            id,
            name: `${firstName} ${lastName}`,
            role,
            department,
            avatarUrl: `https://picsum.photos/seed/${id}/150/150`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${id}@synapse.corp`,
            stats: {
                leaveBalance: { used: Math.floor(Math.random() * 8), total: 20 },
                perfectStreak: Math.floor(Math.random() * 80),
                collaborationIndex: parseFloat((Math.random() * 4 + 6).toFixed(1)), // 6.0 to 10.0
            },
            requests: [],
            flightRisk: isHighRisk ? {
                score: Math.floor(Math.random() * 30) + 70, // 70-99%
                contributingFactors: FLIGHT_RISK_FACTORS.slice(0, Math.floor(Math.random() * 3) + 1),
            } : undefined,
             presence: {
                status: 'In Office',
                location: 'Engineering Wing'
            },
            analytics: {
                presenceHeatmapUrl: '/heatmap-placeholder.png'
            }
        });
    }
    return employees;
};

// Generate employees with specified distribution
let allEmployees: Employee[] = [];
let currentId = 100;
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
    const deptEmployees = generateDeptEmployees(count, dept, currentId);
    allEmployees = allEmployees.concat(deptEmployees);
    currentId += count;
}


// Manually create/modify specific employees for the demo
const priyaSharma: Employee = {
    id: '734',
    name: 'Priya Sharma',
    role: 'Lead Fusion Engineer',
    department: 'Fusion Engineering',
    avatarUrl: 'https://picsum.photos/seed/734/150/150',
    email: 'priya.sharma@synapse.corp',
    stats: {
        leaveBalance: { used: 9, total: 20 },
        perfectStreak: 42,
        collaborationIndex: 7.8,
    },
    requests: [
        { id: 'req-1', type: 'leave', startDate: '2024-08-15', endDate: '2024-08-17', status: 'Approved' },
        { id: 'req-2', type: 'regularization', startDate: '2024-07-22', endDate: '2024-07-22', status: 'Approved' },
        { id: 'req-3', type: 'leave', startDate: '2024-09-05', endDate: '2024-09-10', status: 'Pending' },
    ],
    presence: {
        status: 'In Office',
        location: 'Engineering Wing'
    },
    analytics: {
       presenceHeatmapUrl: '/heatmap-placeholder.png'
    }
};

const davidChen: Employee = {
    id: '123',
    name: 'David Chen',
    role: 'Lead Research Scientist',
    department: 'Quantum Computing R&D',
    avatarUrl: `https://picsum.photos/seed/123/150/150`,
    email: 'david.chen@synapse.corp',
    stats: {
        leaveBalance: { used: 12, total: 20 },
        perfectStreak: 8,
        collaborationIndex: 6.8,
    },
    requests: [],
    flightRisk: {
        score: 78,
        contributingFactors: [
            '↓ Decreased time in collaboration zones',
            '↑ Increased short-notice leaves',
            '↓ Below target Collaboration Index',
        ],
    },
    analytics: {
        presenceHeatmapUrl: '/heatmap-placeholder.png'
    }
};

const fatimaAlJamil: HrAdmin = {
    id: '801',
    name: 'Fatima Al-Jamil',
    avatarUrl: `https://picsum.photos/seed/801/150/150`,
};

// Replace or add the specific employees to the main list
const findAndReplace = (employee: Employee) => {
    const index = allEmployees.findIndex(e => e.id === employee.id);
    if (index !== -1) {
        allEmployees[index] = employee;
    } else {
        allEmployees.push(employee);
    }
};
findAndReplace(priyaSharma);
findAndReplace(davidChen);


export const mockEmployees = allEmployees;
export const mockPriyaSharma = priyaSharma;
export const mockDavidChen = davidChen;
export const mockFatimaAlJamil = fatimaAlJamil;

// HR Dashboard specific data
export const hrDashboardData = {
    workforcePulse: {
        totalPresent: mockEmployees.filter(e => e.presence?.status === 'In Office').length,
        totalWorkforce: mockEmployees.length,
        onLeave: mockEmployees.filter(e => e.presence?.status === 'On Leave').length,
        highFlightRisk: mockEmployees.filter(e => e.flightRisk && e.flightRisk.score > 70).length,
        pendingApprovals: 12,
    },
    flightRiskHotlist: mockEmployees
        .filter(e => e.flightRisk && e.flightRisk.score > 70)
        .sort((a, b) => b.flightRisk!.score - a.flightRisk!.score)
        .slice(0, 5),
    departmentCollaboration: DEPARTMENTS.map(dept => ({
        name: dept,
        collaborationIndex: parseFloat(
            (allEmployees
                .filter(e => e.department === dept)
                .reduce((acc, e) => acc + e.stats.collaborationIndex, 0) /
            deptCounts[dept])
            .toFixed(1)
        ),
        target: 8.5
    }))
};
