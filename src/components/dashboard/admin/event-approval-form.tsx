'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { approveEventAction } from '@/actions/event-approval';
import type { EventApprovalOutput } from '@/ai/flows/event-approval';

const formSchema = z.object({
  eventDetails: z
    .string()
    .min(50, {
      message: 'Event details must be at least 50 characters.',
    })
    .max(1000, {
      message: 'Event details must not exceed 1000 characters.',
    }),
});

export default function EventApprovalForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EventApprovalOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventDetails: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    setError(null);

    const res = await approveEventAction(values);
    
    if (res.success && res.data) {
      setResult(res.data);
    } else {
      setError(res.error || 'An unknown error occurred.');
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="eventDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter event name, description, date, time, location, etc."
                    className="resize-none"
                    rows={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Check for Approval'
            )}
          </Button>
        </form>
      </Form>

      {result && (
        <Alert variant={result.isApproved ? 'default' : 'destructive'}>
          {result.isApproved ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {result.isApproved ? 'Event Approved' : 'Event Rejected'}
          </AlertTitle>
          <AlertDescription>{result.reason}</AlertDescription>
        </Alert>
      )}

      {error && (
         <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
