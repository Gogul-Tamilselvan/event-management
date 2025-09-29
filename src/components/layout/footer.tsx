import Link from 'next/link';
import { Twitter, Linkedin, Instagram } from 'lucide-react';
import { Logo } from './logo';
import { Button } from '../ui/button';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="text-accent" />
              <span className="font-bold font-headline text-lg">
                Zenith Events
              </span>
            </Link>
            <p className="text-sm text-gray-300">
              Elevating Events to Excellence.
            </p>
          </div>
          <div>
            <h3 className="font-headline font-semibold text-white">Navigate</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-accent">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="text-gray-300 hover:text-accent"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#upcoming-events"
                  className="text-gray-300 hover:text-accent"
                >
                  Events
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold text-white">Support</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="/support"
                  className="text-gray-300 hover:text-accent"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-accent"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-300 hover:text-accent"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold text-white">
              Follow Us
            </h3>
            <div className="flex mt-4 space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-accent hover:bg-white/10"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-accent hover:bg-white/10"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-accent hover:bg-white/10"
              >
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Zenith Events. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
