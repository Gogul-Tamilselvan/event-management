
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Event } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { deleteEventAction } from '@/actions/delete-event';

type ManagedEventsProps = {
  events: Event[];
};

const statusVariant = {
  Approved: 'default',
  Pending: 'secondary',
  Rejected: 'destructive',
} as const;

export default function ManagedEvents({ events: initialEvents }: ManagedEventsProps) {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  
  const openDeleteDialog = (event: Event) => {
    setSelectedEvent(event);
    setIsAlertOpen(true);
  }

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    setIsDeleting(true);
    const result = await deleteEventAction(selectedEvent.id);
    
    if (result.success) {
      setEvents(events.filter(e => e.id !== selectedEvent.id));
      toast({ title: "Success", description: "Event has been deleted." });
    } else {
      toast({ title: "Error", description: result.error, variant: 'destructive' });
    }
    
    setIsDeleting(false);
    setIsAlertOpen(false);
    setSelectedEvent(null);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Events</CardTitle>
          <CardDescription>A list of events you are organizing.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Attendees</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={event.title}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={event.image}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>
                    {event.isPaid ? `₹${event.price}` : 'Free'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[event.status]}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {event.attendees.toLocaleString()} / {event.capacity.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href="#">Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link href="/dashboard/organizer/attendees">View Attendees</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => openDeleteDialog(event)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event
              "{selectedEvent?.title}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvent} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
