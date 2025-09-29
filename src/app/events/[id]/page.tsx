

'use client';

import Image from "next/image";
import { Calendar, MapPin, Mail, Clock, Loader2, UserPlus, CreditCard } from "lucide-react";
import { getEvents, getJoinRequests } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notFound, useParams, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import type { Event, JoinRequest } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { requestToJoinAction } from "@/actions/request-to-join";


export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [joinRequestStatus, setJoinRequestStatus] = useState<JoinRequest['status'] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, userProfile } = useAuth();

  useEffect(() => {
    async function fetchEventAndRequestStatus() {
      const events = await getEvents();
      const currentEvent = events.find((e) => e.id === id);

      if (currentEvent) {
        setEvent(currentEvent);
        if (user) {
          const requests = await getJoinRequests();
          const existingRequest = requests.find(req => req.eventId === id && req.attendeeId === user.uid);
          if (existingRequest) {
            setJoinRequestStatus(existingRequest.status);
          }
        }
      } else {
        notFound();
      }
      setLoading(false);
    }
    fetchEventAndRequestStatus();
  }, [id, user]);

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  
  if (!event) {
    return notFound();
  }
  
  const generateCalendarLink = (event: Event, type: 'google' | 'outlook' | 'ical') => {
    const startTime = new Date(`${event.date}T${event.time.split(' - ')[0]}`).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endTime = new Date(`${event.date}T${event.time.split(' - ')[1]}`).toISOString().replace(/-|:|\.\d\d\d/g, '');

    if (type === 'google') {
      return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    }
    return '#';
  };

  const handleRequestToJoin = async () => {
    if (!userProfile) {
        toast({ title: "Please login to join", variant: "destructive"});
        router.push('/login');
        return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('eventId', event.id);
    formData.append('attendeeId', userProfile.id);

    const result = await requestToJoinAction(formData);
    
    if (result.success) {
        toast({
        title: "Request Sent!",
        description: `Your request to join ${event.title} has been sent to the organizer.`,
        });
        setJoinRequestStatus('pending');
    } else {
        toast({ title: "Error", description: result.error, variant: 'destructive'});
    }
    setIsSubmitting(false);
  };
  
  const handlePayment = async () => {
    if (!userProfile) {
        toast({ title: "Please login to join", variant: "destructive"});
        router.push('/login');
        return;
    }
    const upiId = 'your-upi-id@okhdfcbank'; // Replace with a placeholder or your actual UPI ID
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(event.organizer)}&am=${event.price}&cu=INR&tn=${encodeURIComponent(`Payment for ${event.title}`)}`;
    
    // In a real app, you'd open this URL. For this demo, we'll simulate the payment and then send the request.
    window.open(upiUrl, '_blank');

    toast({
        title: "Waiting for payment confirmation...",
        description: "Once your payment is complete, your request to join will be sent automatically.",
    });

    // Simulate waiting for payment webhook, then proceed
    setTimeout(async () => {
       await handleRequestToJoin();
       toast({
        title: "Payment Received!",
        description: `Your request for ${event.title} is now pending organizer approval.`,
        });
    }, 3000);
  };

  const handleEmailReminder = () => {
    toast({
      title: "Reminder Set!",
      description: `We will email you a reminder for ${event.title} 24 hours before it starts.`,
    });
  };

  const renderJoinButton = () => {
      if (!user) {
          return <Button size="lg" className="w-full" onClick={() => router.push('/login')}>Login to Join</Button>
      }
      if (joinRequestStatus === 'approved') {
          return <Button size="lg" className="w-full" disabled>Attending</Button>
      }
      if (joinRequestStatus === 'pending') {
          return <Button size="lg" className="w-full" disabled>Request Sent</Button>
      }
      if (joinRequestStatus === 'rejected') {
          return <Button size="lg" className="w-full" variant="destructive" disabled>Request Rejected</Button>
      }

      if (event.isPaid) {
          return (
            <Button size="lg" className="w-full" onClick={handlePayment} disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : <><CreditCard className="mr-2 h-4 w-4" />Pay ₹{event.price} to Join</>}
            </Button>
          )
      }

      return (
        <Button size="lg" className="w-full" onClick={handleRequestToJoin} disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : <><UserPlus className="mr-2 h-4 w-4" />Request to Join</>}
        </Button>
      );
  }

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
                 {event.isPaid && (
                    <div className="flex items-start">
                        <CreditCard className="h-5 w-5 mr-3 mt-1 text-primary" />
                        <div>
                            <p className="font-semibold">Price</p>
                            <p className="text-muted-foreground font-bold text-lg">₹{event.price}</p>
                        </div>
                    </div>
                )}
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
                     {renderJoinButton()}
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
                    <Button variant="outline" size="lg" className="w-full" onClick={handleEmailReminder}>
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
