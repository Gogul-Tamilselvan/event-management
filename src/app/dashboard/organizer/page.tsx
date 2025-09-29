
import {
    Activity,
    Users,
    CalendarCheck,
    PlusCircle
  } from 'lucide-react'
  
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card'
  import { getEvents } from '@/lib/data';
  import ManagedEvents from '@/components/dashboard/organizer/managed-events';
  import CreateEventForm from '@/components/dashboard/organizer/create-event-form';
  
  export default async function OrganizerDashboardPage() {
    const allEvents = await getEvents();
    // In a real app, this should be filtered by the logged-in organizer's ID
    const organizerEvents = allEvents.filter(e => e.organizer === 'Jane Smith' || e.organizer === 'Organizer One');
    const totalAttendees = organizerEvents.reduce((acc, event) => acc + event.attendees, 0);
    const approvedEvents = organizerEvents.filter(e => e.status === 'Approved').length;

    return (
        <div className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    Total Events
                    </CardTitle>
                    <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{organizerEvents.length}</div>
                    <p className="text-xs text-muted-foreground">
                    Managed by you
                    </p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    Total Attendees
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalAttendees.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                    Across all your events
                    </p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved Events</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{approvedEvents}</div>
                    <p className="text-xs text-muted-foreground">
                    Live and bookable
                    </p>
                </CardContent>
                </Card>
                 <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Create New</CardTitle>
                    <PlusCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">New Event</div>
                    <p className="text-xs text-muted-foreground">
                    Start planning your next success
                    </p>
                </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-5">
                <div className="lg:col-span-3">
                    <ManagedEvents events={organizerEvents} />
                </div>
                <div className="lg:col-span-2">
                    <CreateEventForm />
                </div>
            </div>
      </div>
    )
  }
