
'use client';

import Link from 'next/link';
import React from 'react';
import {
  Home,
  Users,
  BarChart,
  CheckSquare,
  CalendarPlus,
  Settings,
  Bell,
  User,
  PanelLeft,
  Menu,
  LogOut,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/layout/logo';
import AuthGuard from '@/components/auth/auth-guard';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const NAV_ITEMS = {
  admin: [
    { href: '/dashboard/admin', icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
    { href: '/dashboard/admin#event-approvals', icon: <CheckSquare className="h-5 w-5" />, label: 'Event Approvals' },
    { href: '/dashboard/admin#user-management', icon: <Users className="h-5 w-5" />, label: 'User Management' },
    { href: '/dashboard/admin#analytics', icon: <BarChart className="h-5 w-5" />, label: 'Analytics' },
    { href: '/account', icon: <Settings className="h-5 w-5" />, label: 'Settings' },
  ],
  organizer: [
    { href: '/dashboard/organizer', icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
    { href: '/dashboard/organizer#create-event', icon: <CalendarPlus className="h-5 w-5" />, label: 'Create Event' },
    { href: '/dashboard/organizer#my-events', icon: <Users className="h-5 w-5" />, label: 'My Events' },
    { href: '/account', icon: <Settings className="h-5 w-5" />, label: 'Settings' },
  ],
  attendee: [
    { href: '/dashboard/attendee', icon: <Home className="h-5 w-5" />, label: 'My Events' },
    { href: '/account', icon: <Settings className="h-5 w-5" />, label: 'Profile' },
  ],
};

function getNavItems(role: 'admin' | 'organizer' | 'attendee') {
  return NAV_ITEMS[role] || NAV_ITEMS.attendee;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, userProfile, loading } = useAuth();
  const pathname = usePathname();
  const userRole = userProfile?.role.toLowerCase() as keyof typeof NAV_ITEMS ?? 'attendee';
  const navItems = getNavItems(userRole);

  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = '/';
  };
  
  const BreadcrumbTrail = () => {
    const pathParts = pathname.split('/').filter(part => part);
    const trail = pathParts.map((part, index) => {
        const href = `/${pathParts.slice(0, index + 1).join('/')}`;
        const isLast = index === pathParts.length - 1;
        const text = part.charAt(0).toUpperCase() + part.slice(1);

        return (
            <React.Fragment key={href}>
                <BreadcrumbItem>
                    {isLast ? (
                        <BreadcrumbPage>{text}</BreadcrumbPage>
                    ) : (
                        <BreadcrumbLink asChild>
                            <Link href={href}>{text}</Link>
                        </BreadcrumbLink>
                    )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
        );
    });

    return <Breadcrumb className="hidden md:flex"><BreadcrumbList>{trail}</BreadcrumbList></Breadcrumb>;
  }

  return (
    <AuthGuard>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Logo className="h-6 w-6 text-primary" />
                <span className="font-headline">Zenith Events</span>
              </Link>
              <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {loading ? (
                    <>
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </>
                ) : (
                    navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === item.href ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
                    >
                        {item.icon}
                        {item.label}
                    </Link>
                    ))
                )}
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                  <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold"
                  >
                    <Logo className="h-6 w-6 text-primary" />
                    <span className="font-headline">Zenith Events</span>
                  </Link>
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${pathname === item.href ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
              <BreadcrumbTrail />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="secondary" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.photoURL ?? ''} alt={userProfile?.name ?? ''} />
                        <AvatarFallback>{userProfile?.name?.charAt(0) ?? 'U'}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/account">Settings</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/support">Support</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {loading ? <div className="flex items-center justify-center h-full w-full"><Loader2 className="h-8 w-8 animate-spin" /></div> : children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
