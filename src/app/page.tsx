
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  CalendarPlus,
  BarChart2,
  Mail,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { placeholderImages } from '@/lib/placeholder-images';
import { getEvents } from '@/lib/data';

const features = [
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: 'Role-Based Security',
    description:
      'Secure access for Admins, Organizers, and Attendees with tailored permissions.',
  },
  {
    icon: <CalendarPlus className="h-10 w-10 text-primary" />,
    title: 'Effortless Event Management',
    description:
      'Create, manage, and track your events with our intuitive organizer dashboard.',
  },
  {
    icon: <BarChart2 className="h-10 w-10 text-primary" />,
    title: 'Powerful Analytics',
    description:
      'Gain insights with comprehensive analytics on user engagement and event performance.',
  },
  {
    icon: <Mail className="h-10 w-10 text-primary" />,
    title: 'Automated Communication',
    description:
      'Keep attendees informed with automated email reminders and calendar integrations.',
  },
];

const testimonials = [
  {
    name: 'Sarah L.',
    role: 'CEO, Innovate Inc.',
    avatar: placeholderImages.find(p => p.id === 'avatar-1'),
    comment:
      'Zenith Events transformed how we manage our conferences. The platform is powerful, yet incredibly easy to use. The analytics dashboard is a game-changer for us.',
  },
  {
    name: 'Michael B.',
    role: 'Event Organizer, Global Expo',
    avatar: placeholderImages.find(p => p.id === 'avatar-2'),
    comment:
      'The best event management system I have ever used. From attendee registration to post-event analytics, everything is seamless. Their support team is also top-notch.',
  },
  {
    name: 'Jessica P.',
    role: 'Marketing Director, Creative Co.',
    avatar: placeholderImages.find(p => p.id === 'avatar-3'),
    comment:
      'Our attendees love the easy RSVP and calendar integration. Zenith Events has significantly improved our event attendance and engagement rates. Highly recommended!',
  },
];

export default async function Home() {
  const heroImage = placeholderImages.find(p => p.id === 'hero-background');
  const upcomingEvents = (await getEvents()).slice(0, 4);

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] md:h-[80vh] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            Elevating Events to Excellence
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-200">
            Zenith Events provides a seamless, sophisticated platform for
            managing world-class events. From intimate gatherings to global
            conferences, we provide the tools for success.
          </p>
          <div className="mt-8 flex gap-4">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-black">
              <Link href="/dashboard/organizer">Create an Event <ArrowRight className="ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
              A New Standard in Event Management
            </h2>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to plan, execute, and analyze your events with
              precision and style.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                {feature.icon}
                <h3 className="mt-4 font-headline text-xl font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="upcoming-events" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
              Upcoming Events
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Discover and join events managed with Zenith.
            </p>
          </div>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {upcomingEvents.map((event) => (
                <CarouselItem
                  key={event.id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
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
                        <CardTitle className="font-headline text-xl">
                          {event.title}
                        </CardTitle>
                        <CardDescription>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-muted-foreground">
                          {event.location}
                        </p>
                      </CardContent>
                      <div className="p-6 pt-0">
                        <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                          <Link href={`/events/${event.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-12" />
            <CarouselNext className="mr-12" />
          </Carousel>
        </div>
      </section>

      <section id="testimonials" className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
              What Our Clients Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="flex flex-col justify-between">
                <CardHeader>
                  <p className="text-muted-foreground">
                    "{testimonial.comment}"
                  </p>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  {testimonial.avatar && (
                     <Avatar>
                      <AvatarImage src={testimonial.avatar.imageUrl} alt={testimonial.name} data-ai-hint={testimonial.avatar.imageHint} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
