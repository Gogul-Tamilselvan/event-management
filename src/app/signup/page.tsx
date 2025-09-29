'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, CalendarPlus, UserCog } from 'lucide-react';
import { Logo } from '@/components/layout/logo';

type Role = 'Attendee' | 'Organizer' | 'Admin';

const RoleForm = ({ role }: { role: Role }) => {
    const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // In a real app, you would handle signup here and redirect
        const rolePath = role.toLowerCase();
        window.location.href = `/dashboard/${rolePath}`;
    };

  return (
    <form onSubmit={handleSignup}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${role}-name`}>Full Name</Label>
          <Input id={`${role}-name`} type="text" placeholder="John Doe" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${role}-email`}>Email</Label>
          <Input id={`${role}-email`} type="email" placeholder="m@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${role}-password`}>Password</Label>
          <Input id={`${role}-password`} type="password" required />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full" type="submit">Create {role} Account</Button>
      </CardFooter>
    </form>
  );
};

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Tabs defaultValue="Attendee" className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Logo className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
            <CardDescription>
              Join Zenith Events by selecting your role below.
            </CardDescription>
          </CardHeader>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="Attendee">
              <User className="mr-2 h-4 w-4" /> Attendee
            </TabsTrigger>
            <TabsTrigger value="Organizer">
              <CalendarPlus className="mr-2 h-4 w-4" /> Organizer
            </TabsTrigger>
            <TabsTrigger value="Admin">
              <UserCog className="mr-2 h-4 w-4" /> Admin
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Attendee">
            <RoleForm role="Attendee" />
          </TabsContent>
          <TabsContent value="Organizer">
            <RoleForm role="Organizer" />
          </TabsContent>
          <TabsContent value="Admin">
            <RoleForm role="Admin" />
          </TabsContent>
          <CardFooter className="justify-center border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </Tabs>
    </div>
  );
}
