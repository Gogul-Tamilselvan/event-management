
'use server';

import { getEvents, getJoinRequests } from '@/lib/data';
import type { Event, JoinRequest } from '@/lib/data';

type AttendeeDashboardData = {
  registeredEvents: (Event & { joinRequestId: string })[];
  pendingRequests: JoinRequest[];
};

type ActionResult = {
  success: boolean;
  data?: AttendeeDashboardData;
  error?: string;
};

export async function getAttendeeDashboardDataAction(userId: string): Promise<ActionResult> {
  try {
    const allEvents = await getEvents();
    const allRequests = await getJoinRequests();

    const userRequests = allRequests.filter(req => req.attendeeId === userId);
    
    const approvedRequests = userRequests.filter(req => req.status === 'approved');

    const userRegisteredEvents = approvedRequests.map(req => {
        const event = allEvents.find(e => e.id === req.eventId);
        return {
            ...event,
            joinRequestId: req.id,
        } as (Event & { joinRequestId: string });
    }).filter(e => e.id); // Filter out any cases where event was not found

    const userPendingRequests = userRequests.filter(req => req.status === 'pending');

    return { 
        success: true, 
        data: {
            registeredEvents: userRegisteredEvents,
            pendingRequests: userPendingRequests,
        }
    };
  } catch (e) {
    console.error("Error fetching attendee dashboard data: ", e);
    const error = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return { success: false, error: error };
  }
}
