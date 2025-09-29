

'use client';

import RegisteredEvents from "@/components/dashboard/attendee/registered-events";
import { getEvents, getJoinRequests } from "@/lib/data";
import type { Event, JoinRequest } from "@/lib/data";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function AttendeeDashboardPage() {
    const { user } = useAuth();
    const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
    const [pendingRequests, setPendingRequests] = useState<JoinRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEventsAndRequests() {
            if (!user) {
                setLoading(false);
                return;
            };

            const allEvents = await getEvents();
            const allRequests = await getJoinRequests();

            const userRequests = allRequests.filter(req => req.attendeeId === user.uid);
            
            const approvedRequestEventIds = userRequests
                .filter(req => req.status === 'approved')
                .map(req => req.eventId);

            const userRegisteredEvents = allEvents.filter(event => approvedRequestEventIds.includes(event.id));
            const userPendingRequests = userRequests.filter(req => req.status === 'pending');

            setRegisteredEvents(userRegisteredEvents);
            setPendingRequests(userPendingRequests);
            setLoading(false);
        }
        fetchEventsAndRequests();
    }, [user]);


    if (loading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">My Events</h1>
                <p className="text-muted-foreground">Here are the events you're approved to attend.</p>
            </div>
            {registeredEvents.length > 0 ? (
                <RegisteredEvents events={registeredEvents} />
            ) : (
                <p>You haven't been approved for any events yet.</p>
            )}

            {pendingRequests.length > 0 && (
                 <div>
                    <h2 className="text-2xl font-bold font-headline">Pending Requests</h2>
                    <p className="text-muted-foreground">You have requested to join these events. Awaiting organizer approval.</p>
                    <ul className="mt-4 space-y-2">
                        {pendingRequests.map(req => (
                            <li key={req.id} className="p-4 bg-muted rounded-lg">{req.eventTitle} - <span className="font-semibold capitalize">{req.status}</span></li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
