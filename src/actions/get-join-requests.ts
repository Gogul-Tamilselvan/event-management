'use server';

import { getJoinRequests } from '@/lib/data';
import type { JoinRequest } from '@/lib/data';

type ActionResult = {
  success: boolean;
  requests?: JoinRequest[];
  error?: string;
};

export async function getJoinRequestsAction(organizerId: string): Promise<ActionResult> {
  try {
    const allRequests = await getJoinRequests();
    const organizerRequests = allRequests.filter(req => req.organizerId === organizerId);
    return { success: true, requests: organizerRequests };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return { success: false, error: error };
  }
}
