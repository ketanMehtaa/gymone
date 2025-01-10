'use client';

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { DashboardShell } from '@/components/shell';
import { DashboardHeader } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { MembershipPlansTable } from './components/membership-plans-table';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function MembershipPlansPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      redirect('/');
    }

    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/memberships');
        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading='Membership Plans'
        description='Manage your gym membership plans'
      >
        <Link href='/memberships/new'>
          <Button>
            <Icons.add className='mr-2 h-4 w-4' />
            Add Plan
          </Button>
        </Link>
      </DashboardHeader>
      <div>
        <MembershipPlansTable data={plans} />
      </div>
    </DashboardShell>
  );
}
