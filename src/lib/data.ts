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

export const users: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@zenith.com', role: 'Admin', avatar: placeholderImages.find(p => p.id === 'avatar-1')?.imageUrl || '', status: 'Active', lastLogin: '2024-05-20T10:00:00Z' },
  { id: '2', name: 'Organizer One', email: 'organizer1@zenith.com', role: 'Organizer', avatar: placeholderImages.find(p => p.id === 'avatar-2')?.imageUrl || '', status: 'Active', lastLogin: '2024-05-20T11:30:00Z' },
  { id: '3', name: 'Attendee Zero', email: 'attendee0@example.com', role: 'Attendee', avatar: placeholderImages.find(p => p.id === 'avatar-3')?.imageUrl || '', status: 'Active', lastLogin: '2024-05-19T15:00:00Z' },
  { id: '4', name: 'John Doe', email: 'john.d@example.com', role: 'Attendee', avatar: '', status: 'Inactive', lastLogin: '2024-04-01T12:00:00Z' },
  { id: '5', name: 'Jane Smith', email: 'jane.s@example.com', role: 'Organizer', avatar: placeholderImages.find(p => p.id === 'avatar-1')?.imageUrl || '', status: 'Active', lastLogin: '2024-05-20T09:00:00Z' },
];

export const events: Event[] = [
    {
        id: '1',
        title: 'Annual Tech Summit 2024',
        date: '2024-10-15',
        time: '09:00 - 17:00',
        location: 'Silicon Valley Convention Center',
        description: 'Join industry leaders for the biggest tech event of the year. Discover new trends, network with peers, and witness groundbreaking innovations.',
        organizer: 'Organizer One',
        attendees: 1250,
        capacity: 2000,
        status: 'Approved',
        category: 'Technology',
        image: placeholderImages.find(p => p.id === 'event-1')?.imageUrl || '',
    },
    {
        id: '2',
        title: 'Global Marketing Expo',
        date: '2024-11-05',
        time: '10:00 - 18:00',
        location: 'Javits Center, New York City, NY',
        description: 'The premier event for marketing professionals. Learn from the best, explore cutting-edge marketing technologies, and expand your network.',
        organizer: 'Jane Smith',
        attendees: 3500,
        capacity: 5000,
        status: 'Approved',
        category: 'Marketing',
        image: placeholderImages.find(p => p.id === 'event-2')?.imageUrl || '',
    },
    {
        id: '3',
        title: 'Future of Healthcare Conference',
        date: '2024-12-02',
        time: '08:30 - 16:30',
        location: 'McCormick Place, Chicago, IL',
        description: 'A deep dive into the innovations shaping the future of healthcare, from AI diagnostics to personalized medicine.',
        organizer: 'Organizer One',
        attendees: 800,
        capacity: 1000,
        status: 'Approved',
        category: 'Healthcare',
        image: placeholderImages.find(p => p.id === 'event-3')?.imageUrl || '',
    },
    {
        id: '4',
        title: 'Innovators & Investors Gala',
        date: '2025-01-20',
        time: '19:00 - 23:00',
        location: 'The Grand Ballroom, San Francisco, CA',
        description: 'An exclusive black-tie event connecting visionary entrepreneurs with leading investors. A night of networking, pitches, and opportunities.',
        organizer: 'Jane Smith',
        attendees: 150,
        capacity: 200,
        status: 'Pending',
        category: 'Networking',
        image: placeholderImages.find(p => p.id === 'event-4')?.imageUrl || '',
    },
     {
        id: '5',
        title: 'Local Artisans Market',
        date: '2024-09-15',
        time: '11:00 - 19:00',
        location: 'Community Park, Downtown',
        description: 'A vibrant outdoor market showcasing the best local artisans and crafters. A family-friendly event with live music and food trucks.',
        organizer: 'Organizer One',
        attendees: 0,
        capacity: 10000,
        status: 'Rejected',
        category: 'Community',
        image: 'https://picsum.photos/seed/106/600/400',
    }
];

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
