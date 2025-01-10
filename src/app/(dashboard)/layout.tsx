'use client';

import { redirect } from 'next/navigation';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { UserNav } from '@/components/layout/user-nav';
import { useAuth } from '@/contexts/auth-context';
import { useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      redirect('/');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className='flex min-h-screen bg-background'>
        <AppSidebar />
        <div className='flex-1'>
          <header className='sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='container flex h-16 items-center justify-between py-4'>
              <div className='flex items-center gap-4'>
                <h2 className='text-lg font-semibold'>Dashboard</h2>
              </div>
              <UserNav />
            </div>
          </header>
          <main className='container space-y-4 p-8'>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
