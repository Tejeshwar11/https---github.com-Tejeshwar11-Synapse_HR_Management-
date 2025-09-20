'use server';
/**
 * @fileOverview A chatbot for answering employee questions.
 *
 * - employeeChatbot - A function that handles chatbot queries.
 * - EmployeeChatbotInput - The input type for the employeeChatbot function.
 * - EmployeeChatbotOutput - The return type for the employeeChatbot function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Employee } from '@/lib/types';

const EmployeeChatbotInputSchema = z.object({
  query: z.string().describe("The employee's question."),
  employee: z.any().describe('The full employee data object. This may be null if no specific employee data is available.'),
});
export type EmployeeChatbotInput = z.infer<typeof EmployeeChatbotInputSchema>;

const EmployeeChatbotOutputSchema = z.string().describe("The chatbot's answer to the question.");
export type EmployeeChatbotOutput = z.infer<typeof EmployeeChatbotOutputSchema>;


export async function employeeChatbot(input: EmployeeChatbotInput): Promise<EmployeeChatbotOutput> {
  return employeeChatbotFlow(input);
}


const prompt = ai.definePrompt({
  name: 'employeeChatbotPrompt',
  input: { schema: EmployeeChatbotInputSchema },
  output: { schema: EmployeeChatbotOutputSchema },
  prompt: `You are a professional, friendly, and helpful HR assistant chatbot for a company called AttendanceZen. Your role is to answer employee questions accurately and concisely.

{{#if employee}}
You are speaking with an employee. Use the following data to answer their specific questions. Do not refer to the data if the question is general (e.g., "what is the company's vacation policy?").

Employee Details:
- Name: {{{employee.name}}}
- ID: {{{employee.id}}}
- Department: {{{employee.department}}}
- Email: {{{employee.email}}}
- Remaining Leave Balance: {{{employee.leaveBalance}}} days
- Half-Days Taken this Quarter: {{{employee.halfDays}}}

Recent Leave/Regularization Requests:
{{#each employee.requests}}
- Request from {{startDate}} to {{endDate}} for "{{reason}}" is currently {{status}}.
{{/each}}

Recent Attendance (last 10 records):
{{#each employee.attendance}}
  {{#if @index < 10}}
    - On {{date}}, status was {{status}}.
  {{/if}}
{{/each}}
{{/if}}

Answer the following employee question. If the question is about the employee's personal data and you don't have the answer from the context above, politely state that you do not have access to that specific information. For general questions about HR policies, provide helpful, standard answers as a professional HR assistant would.

Employee's Question:
"{{{query}}}"
`,
});


const employeeChatbotFlow = ai.defineFlow(
  {
    name: 'employeeChatbotFlow',
    inputSchema: EmployeeChatbotInputSchema,
    outputSchema: EmployeeChatbotOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
