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
import { User, CalendarPlus } from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import { Separator } from '@/components/ui/separator';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { User as AppUser } from '@/lib/data';


type Role = 'Attendee' | 'Organizer';

const RoleForm = ({ role }: { role: Role }) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        toast({ title: 'Error', description: 'Email and password are required.', variant: 'destructive' });
        setIsLoading(false);
        return;
    }
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = '/dashboard';
    } catch (error: any) {
        console.error("Login Error:", error);
        toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${role}-email`}>Email</Label>
          <Input id={`${role}-email`} name="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${role}-password`}>Password</Label>
          <Input id={`${role}-password`} name="password" type="password" required />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full" type="submit" disabled={isLoading}>{isLoading ? 'Logging in...' : `Login as ${role}`}</Button>
        <p className="text-xs text-muted-foreground">Forgot your password?</p>
      </CardFooter>
    </form>
  );
};

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if the user already exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If user doesn't exist, create a new profile.
        // This handles cases where a user signs in for the first time via Google on the login page.
        const newUserProfile: AppUser = {
          id: user.uid,
          email: user.email || '',
          name: user.displayName || 'New User',
          role: 'Attendee', // Default to 'Attendee' when signing in from login page
          avatar: user.photoURL || '',
          status: 'Active',
          lastLogin: new Date().toISOString(),
        };
        await setDoc(userDocRef, newUserProfile);
      }
      
      // Redirect to a protected route or dashboard on successful login
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
       toast({
        title: "Sign-in Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Tabs defaultValue="Attendee" className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
             <div className="flex justify-center items-center mb-4">
                <Logo className="h-8 w-8 text-primary" />
             </div>
            <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Select your role to sign in to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In with Google'}
            </Button>
            <div className="my-4 flex items-center">
                <Separator className="flex-1" />
                <span className="mx-4 text-xs text-muted-foreground">OR CONTINUE WITH</span>
                <Separator className="flex-1" />
            </div>
          </CardContent>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="Attendee">
              <User className="mr-2 h-4 w-4" /> Attendee
            </TabsTrigger>
            <TabsTrigger value="Organizer">
              <CalendarPlus className="mr-2 h-4 w-4" /> Organizer
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Attendee">
            <RoleForm role="Attendee" />
          </TabsContent>
          <TabsContent value="Organizer">
            <RoleForm role="Organizer" />
          </TabsContent>
          <CardFooter className="justify-center border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </Tabs>
    </div>
  );
}
