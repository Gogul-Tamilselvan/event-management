

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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { JoinRequest } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth.tsx';
import { Loader2 } from 'lucide-react';
import { updateJoinRequestAction } from '@/actions/update-join-request';
import { getJoinRequestsAction } from '@/actions/get-join-requests';

const statusVariant = {
  pending: 'secondary',
  approved: 'default',
  rejected: 'destructive',
  attended: 'default'
} as const;

export default function AttendeeManagementPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchRequests() {
      if (user) {
        const result = await getJoinRequestsAction(user.uid);
        if (result.success && result.requests) {
          setRequests(result.requests);
        } else {
          console.error('Could not fetch join requests:', result.error);
        }
      }
      setLoading(false);
    }
    fetchRequests();
  }, [user]);

  const handleRequestUpdate = async (requestId: string, status: 'approved' | 'rejected', eventId: string) => {
    setUpdating(prev => ({...prev, [requestId]: true}));
    const result = await updateJoinRequestAction(requestId, status, eventId);
    if (result.success) {
      setRequests(prev => prev.map(r => r.id === requestId ? {...r, status} : r));
      console.log(`Request has been ${status}.`);
    } else {
      console.error('Error updating request:', result.error);
    }
    setUpdating(prev => ({...prev, [requestId]: false}));
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendee Requests</CardTitle>
        <CardDescription>
          Manage join requests for your events.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Attendee</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length > 0 ? requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-medium">{req.eventTitle}</TableCell>
                <TableCell>{req.attendeeName}</TableCell>
                <TableCell>{req.attendeeEmail}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[req.status]}>
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {req.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRequestUpdate(req.id, 'approved', req.eventId)}
                        disabled={updating[req.id]}
                      >
                         {updating[req.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRequestUpdate(req.id, 'rejected', req.eventId)}
                        disabled={updating[req.id]}
                      >
                        {updating[req.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reject'}
                      </Button>
                    </>
                  )}
                  {req.status === 'attended' && (
                     <Badge variant='default'>Checked In</Badge>
                  )}
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No join requests found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
