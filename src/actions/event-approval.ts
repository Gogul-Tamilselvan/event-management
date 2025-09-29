'use server';

import { eventApproval, type EventApprovalInput, type EventApprovalOutput } from '@/ai/flows/event-approval';

type ActionResult = {
    success: boolean;
    data?: EventApprovalOutput;
    error?: string;
}

export async function approveEventAction(input: EventApprovalInput): Promise<ActionResult> {
    try {
        const result = await eventApproval(input);
        return { success: true, data: result };
    } catch (e) {
        console.error(e);
        const error = e instanceof Error ? e.message : 'An unexpected error occurred.';
        return { success: false, error: error };
    }
}
