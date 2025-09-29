
'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Event } from '@/lib/data';
import { updateEventStatusAction } from '@/actions/update-event-status';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type EventApprovalsProps = {
  events: Event[];
};

export default function EventApprovals({ events: initialEvents }: EventApprovalsProps) {
  const [events, setEvents] = useState(initialEvents);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleStatusUpdate = async (eventId: string, status: 'Approved' | 'Rejected') => {
    setLoadingStates(prev => ({ ...prev, [eventId]: true }));

    const result = await updateEventStatusAction(eventId, status);

    if (result.success) {
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      toast({
        title: 'Success',
        description: `Event has been ${status.toLowerCase()}.`,
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to update event status.',
        variant: 'destructive',
      });
    }
    
    setLoadingStates(prev => ({ ...prev, [eventId]: false }));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Event Approvals</CardTitle>
        <CardDescription>
          Review and approve or reject events submitted by organizers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Title</TableHead>
              <TableHead>Organizer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length > 0 ? events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>{event.organizer}</TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate(event.id, 'Approved')}
                    disabled={loadingStates[event.id]}
                  >
                    {loadingStates[event.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleStatusUpdate(event.id, 'Rejected')}
                    disabled={loadingStates[event.id]}
                  >
                    {loadingStates[event.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reject'}
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No pending approvals.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
