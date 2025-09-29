
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function DashboardRedirectPage() {
  const { userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userProfile) {
      const { role } = userProfile;
      const rolePath = role.toLowerCase();
      
      // Prevent redirection loop if already on a dashboard page
      if (!window.location.pathname.startsWith(`/dashboard/${rolePath}`)) {
        router.push(`/dashboard/${rolePath}`);
      }
    }
  }, [userProfile, loading, router]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="ml-2">Redirecting to your dashboard...</p>
    </div>
  );
}
