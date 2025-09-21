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
  employee: z.custom<Employee>().describe('The full employee data object.'),
});
export type EmployeeChatbotInput = z.infer<typeof EmployeeChatbotInputSchema>;

const EmployeeChatbotOutputSchema = z.string().describe("The chatbot's answer to the question.");
export type EmployeeChatbotOutput = z.infer<typeof EmployeeChatbotOutputSchema>;


export async function employeeChatbot(input: EmployeeChatbotInput): Promise<EmployeeChatbotOutput> {
  return employeeChatbotFlow(input);
}

const selfReviewPrompt = ai.definePrompt({
  name: 'selfReviewPrompt',
  input: { schema: EmployeeChatbotInputSchema },
  output: { schema: EmployeeChatbotOutputSchema },
  prompt: `You are a helpful AI assistant for a company called Synapse. You are drafting a performance self-review for an employee.
  
  Employee: {{{employee.name}}}
  Role: {{{employee.role}}}
  Department: {{{employee.department}}}
  
  Their OKRs for the last quarter were:
  {{#each employee.goals}}
  - Objective: {{title}}
    {{#each keyResults}}
    - Key Result: {{description}} (Progress: {{progress}}%)
    {{/each}}
  {{/each}}

  They received the following kudos from colleagues:
  {{#each employee.kudos}}
  - "{{message}}" from {{from}}
  {{/each}}
  
  Based on this information, write a professional, positive, and constructive self-review draft. The draft should be in the first person. Start with a brief summary of accomplishments, then elaborate on progress towards each objective, and finally, mention the positive feedback received from peers. Keep it concise, around 3-4 paragraphs.
  `,
});


const regularChatPrompt = ai.definePrompt({
  name: 'employeeChatbotPrompt',
  input: { schema: EmployeeChatbotInputSchema },
  output: { schema: EmployeeChatbotOutputSchema },
  prompt: `You are a professional, friendly, and helpful HR assistant chatbot for a company called Synapse. Your role is to answer employee questions accurately and concisely.

You are speaking with an employee. Use the following data to answer their specific questions. Do not refer to the data if the question is general (e.g., "what is the company's vacation policy?").

Employee Details:
- Name: {{{employee.name}}}
- ID: {{{employee.id}}}
- Department: {{{employee.department}}}
- Email: {{{employee.email}}}
- Remaining Leave Balance: {{@root.remainingLeave}} days
- Half-Days Taken this Quarter: {{{employee.halfDays}}}

Recent Leave/Regularization Requests:
{{#each employee.requests}}
- Request from {{startDate}} to {{endDate}} for "{{reason}}" is currently {{status}}.
{{/each}}

Recent Attendance (last 5 records):
{{#each employee.attendance}}
  {{#if @index < 5}}
    - On {{date}}, status was {{status}}.
  {{/if}}
{{/each}}

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
    
    // Check if the query is for a self-review
    if (input.query.toLowerCase().includes('self-review')) {
      const { output } = await selfReviewPrompt(input);
      return output!;
    }
    
    // For all other queries, use the regular chat prompt
    const remainingLeave = input.employee.stats.leaveBalance.total - input.employee.stats.leaveBalance.used;
    const { output } = await regularChatPrompt({ ...input, remainingLeave });
    return output!;
  }
);
