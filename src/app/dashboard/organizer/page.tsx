
'use client';

import { useEffect, useState } from 'react';
import {
    Activity,
    Users,
    CalendarCheck,
    Clock,
    Loader2,
  } from 'lucide-react'
  
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card'
  import { getEvents, type Event } from '@/lib/data';
  import ManagedEvents from '@/components/dashboard/organizer/managed-events';
  import CreateEventForm from '@/components/dashboard/organizer/create-event-form';
  import { useAuth } from '@/hooks/use-auth.tsx';

  
  export default function OrganizerDashboardPage() {
    const { userProfile } = useAuth();
    const [organizerEvents, setOrganizerEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrganizerEvents() {
            if (userProfile) {
                const allEvents = await getEvents();
                const filteredEvents = allEvents.filter(e => e.organizer === userProfile.name);
                setOrganizerEvents(filteredEvents);
            }
            setLoading(false);
        }
        fetchOrganizerEvents();
    }, [userProfile]);
    
    if (loading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    const totalAttendees = organizerEvents.reduce((acc, event) => acc + (event.attendees || 0), 0);
    const approvedEvents = organizerEvents.filter(e => e.status === 'Approved').length;
    const pendingEvents = organizerEvents.filter(e => e.status === 'Pending').length;

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
                    <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingEvents}</div>
                    <p className="text-xs text-muted-foreground">
                    Awaiting review
                    </p>
                </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-5">
                <div id="my-events" className="lg:col-span-3">
                    <ManagedEvents events={organizerEvents} />
                </div>
                <div id="create-event" className="lg:col-span-2">
                    <CreateEventForm />
                </div>
            </div>
      </div>
    )
  }
