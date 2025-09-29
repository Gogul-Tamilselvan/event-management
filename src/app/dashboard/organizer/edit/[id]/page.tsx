

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth.tsx';
import { Checkbox } from '@/components/ui/checkbox';
import { getEvents, type Event } from '@/lib/data';
import { updateEventAction } from '@/actions/update-event';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  name: z.string().min(1, 'Event name is required.'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters.'),
  date: z.string().min(1, 'Date is required.'),
  time: z.string().min(1, 'Time is required.'),
  location: z.string().min(1, 'Location is required.'),
  category: z.string().min(1, 'Category is required.'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1.'),
  image: z.string().url('A valid image URL is required.'),
  isPaid: z.boolean().default(false),
  price: z.coerce.number().optional(),
  upiId: z.string().optional(),
}).refine(data => !data.isPaid || (data.isPaid && data.price && data.price > 0), {
    message: "Price must be greater than 0 for paid events.",
    path: ["price"],
}).refine(data => !data.isPaid || (data.isPaid && data.upiId && data.upiId.length > 0), {
    message: "UPI ID is required for paid events.",
    path: ["upiId"],
});

export default function EditEventPage() {
  const { id: eventId } = useParams();
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: '',
      capacity: 0,
      image: '',
      isPaid: false,
      price: 0,
      upiId: '',
    },
  });

  useEffect(() => {
    async function fetchEvent() {
      const allEvents = await getEvents();
      const currentEvent = allEvents.find(e => e.id === eventId);
      if (currentEvent) {
        setEvent(currentEvent);
        form.reset({
          name: currentEvent.title,
          description: currentEvent.description,
          date: currentEvent.date,
          time: currentEvent.time,
          location: currentEvent.location,
          category: currentEvent.category,
          capacity: currentEvent.capacity,
          image: currentEvent.image,
          isPaid: currentEvent.isPaid,
          price: currentEvent.price,
          upiId: currentEvent.upiId,
        });
      } else {
        toast({ title: 'Error', description: 'Event not found.', variant: 'destructive' });
        router.push('/dashboard/organizer');
      }
    }
    if (eventId) {
      fetchEvent();
    }
  }, [eventId, form, router, toast]);

  const isPaid = form.watch('isPaid');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userProfile || !eventId) {
      toast({
        title: 'Error',
        description: 'Authentication error or missing event ID.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    const result = await updateEventAction(eventId as string, formData);

    if (result.success) {
      toast({
        title: 'Event Updated!',
        description: 'Your event has been successfully updated.',
      });
      router.push('/dashboard/organizer');
    } else {
      toast({
        title: 'Error',
        description: result.error || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }

    setLoading(false);
  }

  if (!event) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="grid gap-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-12 w-full" />
            </CardContent>
        </Card>
    );
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Event</CardTitle>
        <CardDescription>
          Update the details for your event &quot;{event.title}&quot;.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="networking">Networking</SelectItem>
                        <SelectItem value="community">Community</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="isPaid"
                render={({ field }) => (
                    <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                        <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>
                                Paid Event
                            </FormLabel>
                        </div>
                    </FormItem>
                )}
                />
                {isPaid && (
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Price (₹)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="upiId"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>UPI ID</FormLabel>
                            <FormControl>
                                <Input placeholder="your-upi@bank" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                )}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Event...
                </>
              ) : (
                'Update Event'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
