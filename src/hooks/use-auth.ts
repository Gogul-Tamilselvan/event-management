
'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { type User as AppUser } from '@/lib/data';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile({ id: userDoc.id, ...userDoc.data() } as AppUser);
          } else {
            // This case can happen if a user authenticates but their profile is not in Firestore yet.
            // For this app, we assume a user record is created on signup.
             console.warn("User document not found in Firestore for UID:", user.uid);
             // You might want to create a default profile here or handle it as an error state.
             const newUserProfile: AppUser = {
                id: user.uid,
                email: user.email || '',
                name: user.displayName || 'New User',
                role: 'Attendee', // Default role
                avatar: user.photoURL || '',
                status: 'Active',
                lastLogin: new Date().toISOString()
            };
            setUserProfile(newUserProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, userProfile, loading };
}
