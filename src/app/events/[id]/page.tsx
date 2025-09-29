
import Image from "next/image";
import { Calendar, MapPin, Mail, Clock } from "lucide-react";
import { getEvents } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notFound } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type EventPageProps = {
  params: {
    id: string;
  };
};

export default async function EventPage({ params }: EventPageProps) {
  const events = await getEvents();
  const event = events.find((e) => e.id === params.id);

  if (!event) {
    notFound();
  }
  
  const generateCalendarLink = (event: typeof events[0], type: 'google' | 'outlook' | 'ical') => {
    const startTime = new Date(`${event.date}T${event.time.split(' - ')[0]}`).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endTime = new Date(`${event.date}T${event.time.split(' - ')[1]}`).toISOString().replace(/-|:|\.\d\d\d/g, '');

    if (type === 'google') {
      return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    }
    return '#';
  };

  return (
    <div>
      <section className="relative h-[40vh] md:h-[50vh] w-full">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 z-10 flex h-full flex-col items-start justify-end text-white pb-8">
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
            {event.title}
          </h1>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="font-headline text-2xl font-semibold mb-4">About this Event</h2>
            <p className="text-lg text-muted-foreground whitespace-pre-line">
              {event.description}
            </p>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 mt-1 text-primary" />
                  <div>
                    <p className="font-semibold">Date</p>
                    <p className="text-muted-foreground">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-3 mt-1 text-primary" />
                  <div>
                    <p className="font-semibold">Time</p>
                    <p className="text-muted-foreground">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-primary" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-muted-foreground">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Avatar className="h-8 w-8 mr-3 mt-1">
                    <AvatarImage src="" alt={event.organizer} />
                    <AvatarFallback>{event.organizer.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Organizer</p>
                    <p className="text-muted-foreground">{event.organizer}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-4">
                     <Button size="lg" className="w-full">RSVP Now</Button>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="lg" className="w-full">
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
                    <Button variant="outline" size="lg" className="w-full">
                      <Mail className="mr-2 h-4 w-4" /> Email Reminder
                    </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
