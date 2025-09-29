'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/layout/logo';
import { Separator } from '@/components/ui/separator';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { User as AppUser } from '@/lib/data';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRouter } from 'next/navigation';

type Role = 'Attendee' | 'Organizer';

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('Attendee');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setGoogleLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);

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
              role: selectedRole,
              avatar: user.photoURL || '',
              status: 'Active',
              lastLogin: new Date().toISOString()
          };

          await setDoc(doc(db, "users", user.uid), newUserProfile);
          router.push('/dashboard');
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

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
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
      
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Google Sign-Up Error:", error);
      toast({
        title: "Sign-up Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Logo className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl">Create Your Account</CardTitle>
            <CardDescription>
              Join a community of premium event organizers and attendees.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor='name'>Full Name</Label>
                    <Input id='name' name='name' type='text' placeholder='John Doe' required value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor='email'>Email</Label>
                    <Input id='email' name='email' type='email' placeholder='m@example.com' required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor='password'>Password</Label>
                    <Input id='password' name='password' type='password' required value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                
                <div className="space-y-3">
                    <Label>Select Your Role</Label>
                    <RadioGroup defaultValue="Attendee" onValueChange={(value) => setSelectedRole(value as Role)} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Attendee" id="r1" />
                            <Label htmlFor="r1">Attendee</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Organizer" id="r2" />
                            <Label htmlFor="r2">Organizer</Label>
                        </div>
                    </RadioGroup>
                </div>
                
                <Button className="w-full" type="submit" disabled={isLoading}>{isLoading ? 'Creating account...' : 'Create Account'}</Button>
            </form>
            <div className="my-4 flex items-center">
                <Separator className="flex-1" />
                <span className="mx-4 text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1" />
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogleSignUp} disabled={isGoogleLoading}>
                {isGoogleLoading ? 'Signing up...' : 'Sign Up with Google'}
            </Button>
          </CardContent>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardContent>
      </Card>
    </div>
  );
}
