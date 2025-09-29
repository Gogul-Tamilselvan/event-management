import Image from "next/image";
import Link from "next/link";
import { Calendar, Mail, MapPin } from "lucide-react";
import type { Event } from "@/lib/data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type RegisteredEventsProps = {
  events: Event[];
};

export default function RegisteredEvents({ events }: RegisteredEventsProps) {
  const generateCalendarLink = (event: Event, type: 'google' | 'outlook' | 'ical') => {
    const startTime = new Date(`${event.date}T${event.time.split(' - ')[0]}`).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endTime = new Date(`${event.date}T${event.time.split(' - ')[1]}`).toISOString().replace(/-|:|\.\d\d\d/g, '');

    if (type === 'google') {
      return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    }
    // Note: Outlook/iCal links are more complex and may require generating .ics files server-side for full functionality.
    // These are simplified examples.
    return '#';
  };

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <div className="relative h-48 w-full">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
            />
            <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
              RSVP Confirmed
            </Badge>
          </div>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
                <Link href={`/events/${event.id}`} className="hover:text-primary">{event.title}</Link>
            </CardTitle>
            <div className="flex items-center text-sm text-muted-foreground pt-2">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {event.time}</span>
            </div>
             <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{event.location}</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" /> Add to Calendar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <a href={generateCalendarLink(event, 'google')} target="_blank" rel="noopener noreferrer">Google Calendar</a>
                </DropdownMenuItem>
                <DropdownMenuItem>Outlook</DropdownMenuItem>
                <DropdownMenuItem>iCal</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" /> Email Reminder
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
