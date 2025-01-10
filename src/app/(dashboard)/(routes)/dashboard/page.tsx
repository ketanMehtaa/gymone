'use client';

import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  CreditCard,
  Activity,
  TrendingUp,
  Calendar,
  Settings
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const stats = [
    {
      title: 'Total Members',
      value: '2,350',
      icon: <Users className='h-4 w-4 text-muted-foreground' />,
      href: '/dashboard/members'
    },
    {
      title: 'Active Memberships',
      value: '1,203',
      icon: <CreditCard className='h-4 w-4 text-muted-foreground' />,
      href: '/dashboard/memberships'
    },
    {
      title: "Today's Check-ins",
      value: '45',
      icon: <Activity className='h-4 w-4 text-muted-foreground' />,
      href: '/dashboard/attendance'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Member',
      icon: <Users className='h-5 w-5' />,
      href: '/dashboard/members/new',
      color: 'default'
    },
    {
      title: 'Create Membership',
      icon: <CreditCard className='h-5 w-5' />,
      href: '/dashboard/memberships/new',
      color: 'default'
    },
    {
      title: 'Record Attendance',
      icon: <Calendar className='h-5 w-5' />,
      href: '/dashboard/attendance/new',
      color: 'default'
    }
  ];

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
          <p className='text-muted-foreground'>
            Welcome back, {user?.name || user?.email}
          </p>
        </div>
        <div className='flex gap-4'>
          <Button variant='outline' size='sm'>
            <Settings className='mr-2 h-4 w-4' />
            Settings
          </Button>
          <Button size='sm'>
            <TrendingUp className='mr-2 h-4 w-4' />
            View Reports
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='grid gap-4 md:grid-cols-3'>
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant='outline'
            className='flex h-24 w-full flex-col items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground'
            onClick={() => {
              console.log('Navigating to:', action.href);
              window.location.href = action.href;
            }}
          >
            {action.icon}
            <span>{action.title}</span>
          </Button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {stats.map((stat, index) => (
          <Card
            key={index}
            className='cursor-pointer transition-colors hover:bg-muted/50'
            onClick={() => router.push(stat.href)}
          >
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center gap-4 text-sm'>
              <Activity className='h-4 w-4 text-muted-foreground' />
              <span>John Doe checked in at 9:30 AM</span>
            </div>
            <div className='flex items-center gap-4 text-sm'>
              <CreditCard className='h-4 w-4 text-muted-foreground' />
              <span>New membership created for Sarah Wilson</span>
            </div>
            <div className='flex items-center gap-4 text-sm'>
              <Users className='h-4 w-4 text-muted-foreground' />
              <span>New member registration: Mike Johnson</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
