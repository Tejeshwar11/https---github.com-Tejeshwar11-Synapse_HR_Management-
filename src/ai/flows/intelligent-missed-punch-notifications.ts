'use server';

/**
 * @fileOverview An intelligent missed punch notification AI agent.
 *
 * - intelligentMissedPunchNotification - A function that handles the missed punch notification process.
 * - IntelligentMissedPunchNotificationInput - The input type for the intelligentMissedPunchNotification function.
 * - IntelligentMissedPunchNotificationOutput - The return type for the intelligentMissedPunchNotification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentMissedPunchNotificationInputSchema = z.object({
  employeeId: z.string().describe('The ID of the employee.'),
  employeeRole: z.string().describe('The role of the employee (e.g., Engineer, Manager).'),
  missedPunchTime: z.string().describe('The time the punch was missed (ISO format).'),
  usualPunchTime: z.string().describe('The usual punch time for this employee (ISO format).'),
  dayOfWeek: z.string().describe("The day of the week for the missed punch (e.g., 'Monday')."),
  recentLeave: z.boolean().describe("Whether the employee was on leave recently."),
});
export type IntelligentMissedPunchNotificationInput = z.infer<typeof IntelligentMissedPunchNotificationInputSchema>;

const IntelligentMissedPunchNotificationOutputSchema = z.object({
  shouldNotify: z.boolean().describe('Whether a notification should be sent to the employee.'),
  reason: z.string().describe('The reason for the notification decision.'),
});
export type IntelligentMissedPunchNotificationOutput = z.infer<typeof IntelligentMissedPunchNotificationOutputSchema>;

export async function intelligentMissedPunchNotification(
  input: IntelligentMissedPunchNotificationInput
): Promise<IntelligentMissedPunchNotificationOutput> {
  return intelligentMissedPunchNotificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentMissedPunchNotificationPrompt',
  input: {schema: IntelligentMissedPunchNotificationInputSchema},
  output: {schema: IntelligentMissedPunchNotificationOutputSchema},
  prompt: `You are an advanced HR AI assistant responsible for determining if an employee should be notified about a missed punch. Your goal is to be insightful and avoid unnecessary notifications.

  Employee ID: {{{employeeId}}}
  Employee Role: {{{employeeRole}}}
  Missed Punch Time: {{{missedPunchTime}}}
  Usual Punch Time: {{{usualPunchTime}}}
  Day of the week: {{{dayOfWeek}}}
  Recently on leave: {{{recentLeave}}}

  Consider the following factors to decide if a notification is truly necessary:
  - How often does this employee miss punches historically?
  - Is the missed punch time significantly different from their usual punch time? A few minutes may not be an issue.
  - Is there a pattern? E.g., does this happen often on Mondays?
  - Does their role (e.g., Manager vs. Intern) influence the strictness of punch times?
  - Could the missed punch be related to returning from leave?
  - Is this an unusual day (e.g., Friday afternoon)?

  Based on a holistic analysis of these factors, determine whether a notification should be sent.
  If the missed punch is unusual, out of character, and warrants attention, set shouldNotify to true and provide a concise, friendly, and helpful reason.
  Otherwise, set shouldNotify to false and explain why you've decided a notification is not needed at this time (e.g., "It's only a few minutes late," or "They just returned from leave, let's give them some slack.").

  Format your response as a JSON object with 'shouldNotify' (boolean) and 'reason' (string) fields.
`,
});

const intelligentMissedPunchNotificationFlow = ai.defineFlow(
  {
    name: 'intelligentMissedPunchNotificationFlow',
    inputSchema: IntelligentMissedPunchNotificationInputSchema,
    outputSchema: IntelligentMissedPunchNotificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
