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
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { User as AppUser } from '@/lib/data';

type Role = 'Attendee' | 'Organizer';

const RoleForm = ({ role }: { role: Role }) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!name || !email || !password) {
            toast({ title: 'Error', description: 'All fields are required.', variant: 'destructive' });
            setIsLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: name });
            
            const newUserProfile: AppUser = {
                id: user.uid,
                email: user.email || '',
                name: name,
                role: role,
                avatar: user.photoURL || '',
                status: 'Active',
                lastLogin: new Date().toISOString()
            };

            await setDoc(doc(db, "users", user.uid), newUserProfile);
            window.location.href = '/dashboard';
        } catch (error: any) {
            console.error("Signup Error:", error);
            toast({
                title: "Sign-up Failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <form onSubmit={handleSignup}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${role}-name`}>Full Name</Label>
          <Input id={`${role}-name`} name="name" type="text" placeholder="John Doe" required />
        </div>
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
        <Button className="w-full" type="submit" disabled={isLoading}>{isLoading ? 'Creating account...' : `Create ${role} Account`}</Button>
      </CardFooter>
    </form>
  );
};

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<Role>('Attendee');

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const newUserProfile: AppUser = {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || 'New User',
        role: selectedRole,
        avatar: user.photoURL || '',
        status: 'Active',
        lastLogin: new Date().toISOString()
      };
      
      await setDoc(doc(db, "users", user.uid), newUserProfile, { merge: true });

      // Redirect to a protected route or dashboard on successful signup
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error("Google Sign-Up Error:", error);
      toast({
        title: "Sign-up Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Tabs defaultValue="Attendee" className="w-full max-w-md" onValueChange={(value) => setSelectedRole(value as Role)}>
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
           <CardContent>
             <Button variant="outline" className="w-full" onClick={handleGoogleSignUp} disabled={isLoading}>
                {isLoading ? 'Signing up...' : 'Sign Up with Google'}
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
