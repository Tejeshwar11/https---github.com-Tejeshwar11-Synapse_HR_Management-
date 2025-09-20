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
  query: z.string().describe('The employee\'s question.'),
  employee: z.any().describe('The full employee data object.'),
});
export type EmployeeChatbotInput = z.infer<typeof EmployeeChatbotInputSchema>;

const EmployeeChatbotOutputSchema = z.string().describe('The chatbot\'s answer to the question.');
export type EmployeeChatbotOutput = z.infer<typeof EmployeeChatbotOutputSchema>;


export async function employeeChatbot(input: EmployeeChatbotInput): Promise<EmployeeChatbotOutput> {
  return employeeChatbotFlow(input);
}


const prompt = ai.definePrompt({
  name: 'employeeChatbotPrompt',
  input: { schema: EmployeeChatbotInputSchema },
  output: { schema: EmployeeChatbotOutputSchema },
  prompt: `You are an HR assistant chatbot for a company called AttendanceZen. Your role is to answer employee questions based ONLY on the data provided about them. Be friendly, concise, and professional.

  Today's Date: ${new Date().toDateString()}

  Here is the data for the employee you are talking to:
  
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
  
  Recent Attendance:
  {{#each employee.attendance}}
    {{#if @index < 10}}
      - On {{date}}, status was {{status}}.
    {{/if}}
  {{/each}}

  Based *only* on the information above, answer the following employee question. If the answer cannot be found in the provided data, politely state that you do not have access to that information. Do not make up answers.

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
