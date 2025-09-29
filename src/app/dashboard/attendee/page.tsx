import RegisteredEvents from "@/components/dashboard/attendee/registered-events";
import { events } from "@/lib/data";

export default function AttendeeDashboardPage() {
    // In a real app, this would be filtered by the logged-in user's registrations.
    const registeredEvents = events.slice(0, 2);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">My Events</h1>
                <p className="text-muted-foreground">Here are the events you've registered for.</p>
            </div>
            <RegisteredEvents events={registeredEvents} />
        </div>
    )
}
