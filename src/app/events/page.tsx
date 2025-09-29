
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getEvents, type Event } from '@/lib/data';
import { Loader2 } from 'lucide-react';

function EventCard({ event }: { event: Event }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary">{event.category}</Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-xl">{event.title}</CardTitle>
        <CardDescription>
          {new Date(event.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{event.location}</p>
      </CardContent>
      <div className="p-6 pt-0">
        <Button asChild className="w-full">
          <Link href={`/events/${event.id}`}>View Details</Link>
        </Button>
      </div>
    </Card>
  );
}

export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAndCategorizeEvents() {
      const allEvents = await getEvents();
      const approvedEvents = allEvents.filter(
        (event) => event.status === 'Approved'
      );
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming = approvedEvents.filter(
        (event) => new Date(event.date) >= today
      );
      const past = approvedEvents.filter(
        (event) => new Date(event.date) < today
      );

      setUpcomingEvents(upcoming);
      setPastEvents(past.reverse()); // Show most recent past events first
      setLoading(false);
    }
    fetchAndCategorizeEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          All Events
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore our full calendar of upcoming and past events.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-16">
          <section id="upcoming-events">
            <h2 className="font-headline text-3xl font-bold mb-8">
              Upcoming Events
            </h2>
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No upcoming events at the moment. Check back soon!
              </p>
            )}
          </section>

          <section id="past-events">
            <h2 className="font-headline text-3xl font-bold mb-8">
              Past Events
            </h2>
            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No past events found.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

