
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Calendar,
  ChevronDown,
  LayoutDashboard,
  LifeBuoy,
  LogIn,
  Menu,
  UserPlus,
  Users,
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

const mainNav = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Pricing', href: '/pricing' },
];

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
          : 'bg-transparent'
      )}
    >
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className={cn(isScrolled ? 'text-primary' : 'text-white')} />
            <span
              className={cn(
                'font-bold sm:inline-block font-headline',
                isScrolled ? 'text-foreground' : 'text-white'
              )}
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
                    isScrolled ? 'bg-transparent' : 'bg-transparent text-white hover:bg-white/10'
                  )}
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    isScrolled ? 'bg-transparent' : 'bg-transparent text-white hover:bg-white/10'
                  )}
                >
                  Dashboards
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/support"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isScrolled ? 'bg-transparent' : 'bg-transparent text-white hover:bg-white/10'
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
            <Logo className={cn(isScrolled ? 'text-primary' : 'text-white')} />
            <span
              className={cn(
                'font-bold sm:inline-block font-headline',
                isScrolled ? 'text-foreground' : 'text-white'
              )}
            >
              Zenith Events
            </span>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(isScrolled ? 'text-foreground' : 'text-white hover:bg-white/10 hover:text-white')}
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
                <Link href="/dashboard/admin">Admin Dashboard</Link>
                <Link href="/dashboard/organizer">Organizer Dashboard</Link>
                <Link href="/dashboard/attendee">Attendee Dashboard</Link>
                <Link href="/support">Support</Link>
                 <hr />
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden flex-1 items-center justify-end space-x-2 md:flex">
          <Button asChild variant="ghost" className={cn(isScrolled ? 'text-foreground' : 'text-white hover:bg-white/10 hover:text-white')}>
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Link>
          </Button>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/signup">
              <UserPlus className="mr-2 h-4 w-4" /> Sign Up
            </Link>
          </Button>
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
