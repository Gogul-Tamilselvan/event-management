

import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import data from './placeholder-images.json';

export const placeholderImages = data.placeholderImages;

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Organizer' | 'Attendee';
  avatar: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  organizer: string;
  attendees: number;
  capacity: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  category: string;
  image: string;
};

export type JoinRequest = {
    id: string;
    eventId: string;
    eventTitle: string;
    attendeeId: string;
    attendeeName: string;
    attendeeEmail: string;
    organizerId: string;
    status: 'pending' | 'approved' | 'rejected';
    requestedAt: string;
};


// NOTE: The following data is now fetched from Firestore.
// If your database is empty, you may need to add some data manually in the Firebase console.
export const users: User[] = [];
export const events: Event[] = [];

export async function getUsers(): Promise<User[]> {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users: User[] = [];
        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() } as User);
        });
        return users;
    } catch (error) {
        console.error("Error fetching users: ", error);
        return [];
    }
}

export async function getEvents(): Promise<Event[]> {
    try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const events: Event[] = [];
        querySnapshot.forEach((doc) => {
            events.push({ id: doc.id, ...doc.data() } as Event);
        });
        return events;
    } catch (error) {
        console.error("Error fetching events: ", error);
        return [];
    }
}

export async function getJoinRequests(): Promise<JoinRequest[]> {
    try {
        const querySnapshot = await getDocs(collection(db, "joinRequests"));
        const requests: JoinRequest[] = [];
        querySnapshot.forEach((doc) => {
            requests.push({ id: doc.id, ...doc.data() } as JoinRequest);
        });
        return requests;
    } catch (error) {
        console.error("Error fetching join requests: ", error);
        return [];
    }
}


export const analyticsData = {
    userSignups: [
      { month: 'Jan', signups: 100 },
      { month: 'Feb', signups: 150 },
      { month: 'Mar', signups: 120 },
      { month: 'Apr', signups: 200 },
      { month: 'May', signups: 250 },
      { month: 'Jun', signups: 300 },
    ],
    eventCategories: [
      { name: 'Technology', value: 40, fill: 'var(--color-chart-1)' },
      { name: 'Marketing', value: 25, fill: 'var(--color-chart-2)' },
      { name: 'Healthcare', value: 15, fill: 'var(--color-chart-3)' },
      { name: 'Networking', value: 10, fill: 'var(--color-chart-4)' },
      { name: 'Community', value: 10, fill: 'var(--color-chart-5)' },
    ],
    totalUsers: 5423,
    totalEvents: 128,
    activeEvents: 42,
    pendingApprovals: 1
};
