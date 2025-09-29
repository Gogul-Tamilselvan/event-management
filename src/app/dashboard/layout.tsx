import Link from 'next/link';
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
  Search,
  Menu,
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
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/layout/logo';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const NAV_ITEMS = {
  admin: [
    { href: '/dashboard/admin', icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
    { href: '#', icon: <CheckSquare className="h-5 w-5" />, label: 'Event Approvals' },
    { href: '#', icon: <Users className="h-5 w-5" />, label: 'User Management' },
    { href: '#', icon: <BarChart className="h-5 w-5" />, label: 'Analytics' },
    { href: '#', icon: <Settings className="h-5 w-5" />, label: 'Settings' },
  ],
  organizer: [
    { href: '/dashboard/organizer', icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
    { href: '#', icon: <CalendarPlus className="h-5 w-5" />, label: 'Create Event' },
    { href: '#', icon: <Users className="h-5 w-5" />, label: 'My Events' },
    { href: '#', icon: <Settings className="h-5 w-5" />, label: 'Settings' },
  ],
  attendee: [
    { href: '/dashboard/attendee', icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
    { href: '#', icon: <CalendarPlus className="h-5 w-5" />, label: 'My Registered Events' },
    { href: '#', icon: <Settings className="h-5 w-5" />, label: 'Profile' },
  ],
};

function getNavItems(role: 'admin' | 'organizer' | 'attendee') {
  return NAV_ITEMS[role];
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // In a real app, role would come from user session
  const userRole = 'admin'; 
  const navItems = getNavItems(userRole);

  return (
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
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
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
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                     {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
             {/* Breadcrumb can be dynamically generated based on path */}
             <Breadcrumb className="hidden md:flex">
                <BreadcrumbList>
                    <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/dashboard/admin">Dashboard</Link>
                    </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    <BreadcrumbPage>Admin</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
