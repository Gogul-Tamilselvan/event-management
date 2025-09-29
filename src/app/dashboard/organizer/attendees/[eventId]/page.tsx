
'use client';

import { useEffect, useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import type { JoinRequest } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth.tsx';
import { Loader2 } from 'lucide-react';
import { getJoinRequests } from '@/lib/data';
import { useParams } from 'next/navigation';

export default function EventAttendeesPage() {
  const { user } = useAuth();
  const { eventId } = useParams();
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventName, setEventName] = useState('');

  useEffect(() => {
    async function fetchRequests() {
      if (user && eventId) {
        const allRequests = await getJoinRequests();
        const eventRequests = allRequests.filter(req => req.eventId === eventId);
        
        if (eventRequests.length > 0) {
            setEventName(eventRequests[0].eventTitle);
        }
        setRequests(eventRequests);

      }
      setLoading(false);
    }
    fetchRequests();
  }, [user, eventId]);

  if (loading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  const attendedRequests = requests.filter(r => r.status === 'attended');
  const approvedNotAttendedRequests = requests.filter(r => r.status === 'approved');

  const AttendeeTable = ({title, description, attendees}: {title: string, description: string, attendees: JoinRequest[]}) => (
      <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Attendee</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Requested At</TableHead>
              <TableHead className='text-right'>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendees.length > 0 ? attendees.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-medium">{req.attendeeName}</TableCell>
                <TableCell>{req.attendeeEmail}</TableCell>
                <TableCell>{new Date(req.requestedAt).toLocaleString()}</TableCell>
                <TableCell className="text-right">
                   <Badge variant={req.status === 'attended' ? 'default' : 'secondary'}>
                    {req.status === 'attended' ? 'Checked In' : 'Approved'}
                   </Badge>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No attendees in this category.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  return (
    <div className='space-y-6'>
        <div>
            <h1 className="text-3xl font-bold font-headline">Attendee List</h1>
            <p className="text-muted-foreground">For event: <span className='font-semibold'>{eventName}</span></p>
        </div>

        <AttendeeTable 
            title="Checked-in Attendees"
            description="These attendees have been successfully scanned and checked in."
            attendees={attendedRequests}
        />

        <AttendeeTable 
            title="Approved (Not Checked-in)"
            description="These attendees are approved but have not yet been checked in."
            attendees={approvedNotAttendedRequests}
        />
    </div>
  );
}

