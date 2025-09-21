Synapse: Intelligent HR Management System
Smarter Attendance. Stronger Engagement. Seamless HR.


Synapse is an intelligent, AI-powered workforce management platform that moves beyond traditional HR systems. It leverages predictive analytics and a world-class user experience to help companies proactively manage employee engagement and reduce attrition.

**Features**

Synapse provides two distinct, role-based interfaces designed to empower every member of the organization.


**1. Employee Experience Platform**
   
Secure Authentication: Role-based login system for Employees and HR.

Dynamic Dashboard: A personalized hub with smart attendance, gamified metrics (Perfect Streak), and a unique Collaboration Index.

Advanced Attendance: Wi-Fi validated punch-in/out with automated half-day detection.

Self-Service Tools: Streamlined modules for Leave & Regularization Requests.

Engagement & Culture: A peer-to-peer "Kudos Wall" and a weekly "Wellness Pulse" for anonymous feedback.

Career Growth: A Growth Hub with career path visualization and internal job recommendations.

AI Assistant: The Synapse Assistant chatbot provides instant answers and helps automate tasks.

History: A 3-year interactive attendance calendar and a page to track personal goals (OKRs).


**2. HR Strategic Command Center**

Central Dashboard: A real-time "Workforce Pulse" with live organizational stats.

Predictive Flight Risk: An AI-driven Hotlist that identifies at-risk employees and their contributing factors.

Strategic Analytics: Deep-dive dashboards for Workforce Sentiment, Headcount Forecasting, Compensation Equity, and Team Collaboration.

Talent Management: A dynamic Employee Directory with an interactive Skills Cloud and a Succession Planning module.

Automated Workflows: Trackers for streamlining Onboarding & Offboarding processes.

AI Co-Pilot: The Synapse Co-Pilot chatbot answers complex data queries and generates actionable AI Growth Plans for managers.


**Technology Stack :**

Frontend  :	Next.js, React, TypeScript, Tailwind CSS, ShadCN

Backend  :	Node.js, Express.js, JWT Authentication

Database	:  Firebase Firestore (NoSQL)

Deployment :	Firebase Hosting


Setup & Installation :

To get a local copy up and running, follow these steps.

Prerequisites:

Node.js (v18 or later)

NPM or Yarn

Firebase project setup

Installation:

Bash

# 1. Clone the repository
git clone https://github.com/your-username/synapse.git

# 2. Navigate to the project directory
cd synapse

# 3. Install NPM packages
npm install

# 4. Create a .env.local file and add your API keys
# (see .env.example)
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
GEMINI_API_KEY=your_key

# 5. Start the development server
npm run dev
Access the Application:

Open your browser and navigate to http://localhost:3000

Login Credentials for Demo :

Role	              Email	               Password	            Note
Employee	priya.sharma@synapse.com	SynapseEng@2025	A standard employee profile.

HR/Admin	fatima.clark@synapse.com	HumanRes!Lead01	Full administrative access.

⚙ API Endpoints
The backend follows a RESTful API structure.

Authentication:

POST /api/auth/login - Authenticate a user and return a JWT.

Employees:

GET /api/employees - Get a list of all employees.

GET /api/employees/:id - Get a specific employee's profile.

GET /api/employees/:id/attendance - Get a specific employee's attendance history.

Analytics:

GET /api/analytics/flight-risk - Get the list of high-risk employees.

GET /api/analytics/sentiment - Get aggregated sentiment data.

AI Co-Pilot:

POST /api/ai/generate-growth-plan - Generate a strategic plan for an employee.

**Hackathon Context :**

Our project "SYNAPSE" was built in 48 hours for the Brandverse Hackathon Challenge 2025 (20th–21st September). It is our solution to Problem Statement 3: Intelligent HR Management System.
