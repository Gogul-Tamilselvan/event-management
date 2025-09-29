import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';

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
import type { Event } from '@/lib/data';

type ManagedEventsProps = {
  events: Event[];
};

const statusVariant = {
  Approved: 'default',
  Pending: 'secondary',
  Rejected: 'destructive',
} as const;

export default function ManagedEvents({ events }: ManagedEventsProps) {
  return (
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
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Attendees</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
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
  );
}
