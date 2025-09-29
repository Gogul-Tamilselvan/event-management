'use server';

/**
 * @fileOverview An event approval AI agent.
 *
 * - eventApproval - A function that handles the event approval process.
 * - EventApprovalInput - The input type for the eventApproval function.
 * - EventApprovalOutput - The return type for the eventApproval function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EventApprovalInputSchema = z.object({
  eventDetails: z
    .string()
    .describe('The details of the event, including name, description, date, time, and location.'),
});
export type EventApprovalInput = z.infer<typeof EventApprovalInputSchema>;

const EventApprovalOutputSchema = z.object({
  isApproved: z.boolean().describe('Whether or not the event is approved.'),
  reason: z.string().describe('The reason for approval or rejection.'),
});
export type EventApprovalOutput = z.infer<typeof EventApprovalOutputSchema>;

export async function eventApproval(input: EventApprovalInput): Promise<EventApprovalOutput> {
  return eventApprovalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'eventApprovalPrompt',
  input: {schema: EventApprovalInputSchema},
  output: {schema: EventApprovalOutputSchema},
  prompt: `You are an event approval agent. You will analyze the event details and determine if it conforms to community standards.

  Event Details: {{{eventDetails}}}

  Based on the event details, determine if the event should be approved. If it is not approved, provide a reason.
  Set the isApproved field to true if the event is approved, and false if it is not.
  The reason field should contain a short explanation.
  `,
});

const eventApprovalFlow = ai.defineFlow(
  {
    name: 'eventApprovalFlow',
    inputSchema: EventApprovalInputSchema,
    outputSchema: EventApprovalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
