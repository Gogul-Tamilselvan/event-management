
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  LogOut,
  Menu,
  UserPlus,
} from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Admin Dashboard',
    href: '/dashboard/admin',
    description: 'Manage users, approve events, and view site-wide analytics.',
  },
  {
    title: 'Organizer Dashboard',
    href: '/dashboard/organizer',
    description: 'Create and manage your events, track attendance and more.',
  },
  {
    title: 'Attendee Dashboard',
    href: '/dashboard/attendee',
    description: 'View your registered events and manage your RSVPs.',
  },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { user, userProfile, loading } = useAuth();

  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = '/';
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'border-b bg-card/80 backdrop-blur-lg'
          : 'bg-background/80'
      )}
    >
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="text-primary" />
            <span
              className="font-bold sm:inline-block font-headline text-foreground"
            >
              Zenith Events
            </span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'bg-transparent'
                  )}
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/events"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'bg-transparent'
                  )}
                >
                  Events
                </NavigationMenuLink>
              </NavigationMenuItem>
               {user && (
                 <NavigationMenuItem>
                    <NavigationMenuLink
                        href="/dashboard"
                        className={cn(
                            navigationMenuTriggerStyle(),
                            'bg-transparent'
                        )}
                        >
                        Dashboard
                    </NavigationMenuLink>
                </NavigationMenuItem>
               )}
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/support"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'bg-transparent'
                  )}
                >
                  Support
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Menu */}
        <div className="flex w-full items-center justify-between md:hidden">
           <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="text-primary" />
            <span
              className="font-bold sm:inline-block font-headline text-foreground"
            >
              Zenith Events
            </span>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <Logo />
              </SheetHeader>
              <div className="mt-4 flex flex-col space-y-4">
                <Link href="/">Home</Link>
                <Link href="/events">Events</Link>
                {user ? (
                    <>
                        <Link href="/dashboard">Dashboard</Link>
                        <Link href="/account">Account</Link>
                        <Button onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Logout</Button>
                    </>
                ) : (
                    <>
                        <Link href="/support">Support</Link>
                        <hr />
                        <Button asChild>
                        <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild variant="secondary">
                        <Link href="/signup">Sign Up</Link>
                        </Button>
                    </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden flex-1 items-center justify-end space-x-2 md:flex">
         {loading ? (
             <>
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
             </>
         ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                   <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL ?? ''} alt={userProfile?.name ?? ''} />
                        <AvatarFallback>{userProfile?.name?.charAt(0) ?? 'U'}</AvatarFallback>
                    </Avatar>
                  <span>{userProfile?.name ?? user.email}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/account">Settings</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/support">Support</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" className="text-foreground">
                <Link href="/login">
                  Login
                </Link>
              </Button>
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/signup">
                  <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
