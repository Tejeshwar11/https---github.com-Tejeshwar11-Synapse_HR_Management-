'use server';
/**
 * @fileOverview A multi-persona chatbot for answering employee and HR questions.
 *
 * - employeeChatbot - A function that handles chatbot queries for employees.
 * - hrChatbot - A function that handles chatbot queries for HR.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Employee } from '@/lib/types';
import { mockEmployees } from '@/lib/data';

// --- Employee Chatbot Schemas ---

const EmployeeChatbotInputSchema = z.object({
  query: z.string().describe("The employee's question."),
  employee: z.custom<Employee>().describe('The full employee data object.'),
  history: z.array(z.object({
    role: z.enum(['user', 'bot']),
    content: z.string(),
  })).optional().describe('The chat history.'),
});
export type EmployeeChatbotInput = z.infer<typeof EmployeeChatbotInputSchema>;

const EmployeeChatbotOutputSchema = z.string().describe("The chatbot's answer to the question.");
export type EmployeeChatbotOutput = z.infer<typeof EmployeeChatbotOutputSchema>;

// --- HR Chatbot Schemas ---

const HrChatbotInputSchema = z.object({
  query: z.string().describe("The HR admin's question."),
  history: z.array(z.object({
    role: z.enum(['user', 'bot']),
    content: z.string(),
  })).optional().describe('The chat history.'),
});
export type HrChatbotInput = z.infer<typeof HrChatbotInputSchema>;

const HrChatbotOutputSchema = z.object({
  response: z.string().describe("The chatbot's answer to the question."),
  data: z.any().optional().describe("Optional data payload, e.g., for rendering custom components."),
});
export type HrChatbotOutput = z.infer<typeof HrChatbotOutputSchema>;


// --- Employee Chatbot Implementation ---

export async function employeeChatbot(input: EmployeeChatbotInput): Promise<EmployeeChatbotOutput> {
  const remainingLeave = input.employee.stats.leaveBalance.total - input.employee.stats.leaveBalance.used;
  const { output } = await employeePrompt({ ...input, remainingLeave });
  return output!;
}

const employeePrompt = ai.definePrompt({
  name: 'employeeChatbotPrompt',
  input: { schema: EmployeeChatbotInputSchema.extend({ remainingLeave: z.number() }) },
  output: { schema: EmployeeChatbotOutputSchema },
  prompt: `You are Synapse Assistant, a friendly, helpful, and task-oriented AI chatbot for employees at Synapse Corp.

You are speaking with:
- Name: {{{employee.name}}}
- Department: {{{employee.department}}}
- Remaining Leave Balance: {{@root.remainingLeave}} days

Recent Requests:
{{#each employee.requests}}
- Request for "{{reason}}" is currently {{status}}.
{{/each}}

Keep your answers concise and clear.

If asked about a WFH policy, respond with: "Synapse offers a hybrid model. Employees are expected to be in the office 3 days a week (Tue, Wed, Thu). Please coordinate with your manager for any specific arrangements."
If asked to draft a regularization request, respond with: "To draft a regularization request, please go to your dashboard and click 'Apply for Leave', then select 'Regularization' and fill in the details. This ensures it is formally logged."

Conversation History:
{{#each history}}
- {{role}}: {{content}}
{{/each}}

Based on the context and history, answer the user's latest query.

User's Question:
"{{{query}}}"
`,
});


// --- HR Chatbot Implementation ---

export async function hrChatbot(input: HrChatbotInput): Promise<HrChatbotOutput> {
  return hrChatbotFlow(input);
}

const hrChatbotFlow = ai.defineFlow(
  {
    name: 'hrChatbotFlow',
    inputSchema: HrChatbotInputSchema,
    outputSchema: HrChatbotOutputSchema,
  },
  async (input) => {
    // Check for specific queries to return structured data
    if (input.query.toLowerCase().includes('flight risk')) {
      const highRiskEmployees = mockEmployees
        .filter(e => e.flightRisk && e.flightRisk.score > 70)
        .sort((a, b) => b.flightRisk!.score - a.flightRisk!.score)
        .slice(0, 5);
      
      return {
        response: "Here are the top 5 employees with the highest flight risk scores:",
        data: {
          type: 'flight-risk-list',
          employees: highRiskEmployees.map(e => ({
            id: e.id,
            name: e.name,
            role: e.role,
            flightRisk: e.flightRisk,
          })),
        }
      };
    }

    if (input.query.toLowerCase().includes('growth plan for employee #102')) {
       const employee = mockEmployees.find(e => e.id === '102');
       if (employee) {
         return {
            response: `Here is a suggested growth plan for ${employee.name}:`,
            data: {
                type: 'growth-plan',
                employee,
            }
         }
       }
    }
    
    // Fallback to a general LLM call for other queries
    const { output } = await hrPrompt(input);
    return { response: output! };
  }
);


const hrPrompt = ai.definePrompt({
  name: 'hrChatbotPrompt',
  input: { schema: HrChatbotInputSchema },
  output: { schema: z.string() },
  prompt: `You are Synapse Co-Pilot, a professional, analytical, and strategic AI assistant for HR administrators at Synapse Corp.

You have access to a database of 1,000 employees. Your role is to provide data-driven insights.

Conversation History:
{{#each history}}
- {{role}}: {{content}}
{{/each}}

Based on the context and history, answer the user's latest query.

User's Question:
"{{{query}}}"
`,
});
