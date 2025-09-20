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
  missedPunchTime: z.string().describe('The time the punch was missed (ISO format).'),
  usualPunchTime: z.string().describe('The usual punch time for this employee (ISO format).'),
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
  prompt: `You are an HR assistant responsible for determining if an employee should be notified about a missed punch.

  Employee ID: {{{employeeId}}}
  Missed Punch Time: {{{missedPunchTime}}}
  Usual Punch Time: {{{usualPunchTime}}}

  Consider the following factors to decide if a notification is necessary:
  - How often does this employee miss punches?
  - Is the missed punch time significantly different from their usual punch time?
  - Is there any historical data suggesting a pattern of missed punches around this time?

  Based on this analysis, determine whether a notification should be sent.
  If the missed punch is unusual and warrants attention, set shouldNotify to true and provide a reason.
  Otherwise, set shouldNotify to false and explain why a notification is not needed.

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
