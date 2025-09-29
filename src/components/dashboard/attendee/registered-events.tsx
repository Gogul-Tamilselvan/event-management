
'use client';

import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, QrCode, Loader2 } from "lucide-react";
import type { Event, JoinRequest } from "@/lib/data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth.tsx";
import { createGoogleWalletAction } from "@/actions/google-wallet";
import { useToast } from "@/hooks/use-toast";

type RegisteredEventsProps = {
  events: (Event & { joinRequestId: string })[];
};

export default function RegisteredEvents({ events }: RegisteredEventsProps) {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [loadingWallet, setLoadingWallet] = useState<Record<string, boolean>>({});

  const handleAddToWallet = async (event: Event) => {
    if (!userProfile) return;
    setLoadingWallet(prev => ({...prev, [event.id]: true}));
    
    const result = await createGoogleWalletAction(event, userProfile.name);
    
    if (result.success && result.walletUrl) {
      window.open(result.walletUrl, '_blank');
    } else {
      toast({
        title: "Error",
        description: result.error || "Could not create Google Wallet pass.",
        variant: "destructive"
      });
    }

    setLoadingWallet(prev => ({...prev, [event.id]: false}));
  }

  const getQrCodeUrl = (joinRequestId: string) => {
      const baseUrl = "https://api.qrserver.com/v1/create-qr-code/";
      return `${baseUrl}?size=250x250&data=${encodeURIComponent(joinRequestId)}`;
  }

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
             <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <QrCode className="mr-2 h-4 w-4" />
                        Show QR Code
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Attendee QR Code</DialogTitle>
                    <DialogDescription>
                        The event organizer will scan this code to check you in.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center p-4">
                        <Image
                            src={getQrCodeUrl(event.joinRequestId)}
                            alt="Attendee QR Code"
                            width={250}
                            height={250}
                        />
                    </div>
                </DialogContent>
            </Dialog>
            <Button onClick={() => handleAddToWallet(event)} disabled={loadingWallet[event.id]}>
              {loadingWallet[event.id] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add to Google Wallet
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
