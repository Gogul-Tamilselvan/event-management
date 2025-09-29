
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
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
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
import { useAuth } from '@/hooks/use-auth.tsx';
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

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { user, userProfile, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

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

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/events', label: 'Events' },
    { href: '/#features', label: 'Features' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'border-b bg-background/80 backdrop-blur-lg'
          : 'bg-transparent'
      )}
    >
      <div className="container flex h-20 items-center">
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
              {navLinks.map(link => (
                <NavigationMenuItem key={link.href}>
                    <NavigationMenuLink
                        href={link.href}
                        className={cn(
                            navigationMenuTriggerStyle(),
                            'bg-transparent'
                        )}
                        >
                        {link.label}
                    </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
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

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
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
                 {navLinks.map(link => (
                   <Link key={link.href} href={link.href} onClick={closeMobileMenu}>{link.label}</Link>
                 ))}
                {user ? (
                    <>
                        <hr />
                        <Link href="/dashboard" onClick={closeMobileMenu}>Dashboard</Link>
                        <Link href="/account" onClick={closeMobileMenu}>Account</Link>
                        <Button onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Logout</Button>
                    </>
                ) : (
                    <>
                        <hr />
                        <Button asChild>
                          <Link href="/login" onClick={closeMobileMenu}>Login</Link>
                        </Button>
                        <Button asChild variant="secondary">
                          <Link href="/signup" onClick={closeMobileMenu}>Sign Up</Link>
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
                <Skeleton className="h-9 w-9 rounded-full" />
             </>
         ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                   <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL ?? ''} alt={userProfile?.name ?? ''} />
                        <AvatarFallback>{userProfile?.name?.charAt(0) ?? 'U'}</AvatarFallback>
                    </Avatar>
                  <span className="hidden lg:inline">{userProfile?.name ?? user.email}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/account">Settings</Link></DropdownMenuItem>
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
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
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
