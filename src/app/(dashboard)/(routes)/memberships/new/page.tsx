'use client';

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/shell';
import { DashboardHeader } from '@/components/header';
// import { NewMembershipPlanForm } from "../components/new-membership-plan-form";
import { useAuth } from '@/contexts/auth-context';
import { NewMembershipPlanForm } from './components/new-membership-plan-form';

// export const metadata: Metadata = {
//   title: "New Membership Plan",
//   description: "Create a new membership plan",
// };

export default function NewMembershipPlanPage() {
  const { user } = useAuth();

  if (!user) {
    redirect('/login');
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading='Create New Plan'
        description='Create a new membership plan for your gym'
      />
      <div className='grid gap-10'>
        <NewMembershipPlanForm />
      </div>
    </DashboardShell>
  );
}
