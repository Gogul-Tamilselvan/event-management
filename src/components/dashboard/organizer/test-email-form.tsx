'use client';

import { useState } from 'react';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { sendTestEmailAction } from '@/actions/test-email';

const formSchema = z.object({
  email: z.string().email('A valid email is required.'),
});

export default function TestEmailForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    
    const formData = new FormData();
    formData.append('email', values.email);

    const result = await sendTestEmailAction(formData);

    if (result.success) {
      toast({
        title: 'Test Email Sent!',
        description: `An email has been sent to ${values.email}. Please check the inbox.`,
      });
      form.reset();
    } else {
      toast({
        title: 'Error Sending Email',
        description: result.error || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }

    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Email Service</CardTitle>
        <CardDescription>
          Send a test approval email to verify your EmailJS setup.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="test@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Test...
                </>
              ) : (
                'Send Test Email'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
