
'use client';

import RegisteredEvents from "@/components/dashboard/attendee/registered-events";
import { getEvents } from "@/lib/data";
import type { Event } from "@/lib/data";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function AttendeeDashboardPage() {
    const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            const allEvents = await getEvents();
            // In a real app, this would be filtered by the logged-in user's registrations.
            setRegisteredEvents(allEvents.slice(0, 2));
            setLoading(false);
        }
        fetchEvents();
    }, []);


    if (loading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">My Events</h1>
                <p className="text-muted-foreground">Here are the events you've registered for.</p>
            </div>
            {registeredEvents.length > 0 ? (
                <RegisteredEvents events={registeredEvents} />
            ) : (
                <p>You haven't registered for any events yet.</p>
            )}
        </div>
    )
}
