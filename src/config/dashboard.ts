import { DashboardConfig } from '@/types';

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: 'Documentation',
      href: '/docs'
    },
    {
      title: 'Support',
      href: '/support',
      disabled: true
    }
  ],
  sidebarNav: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: 'dashboard'
    },
    {
      title: 'Members',
      href: '/members',
      icon: 'users'
    },
    {
      title: 'Trainers',
      href: '/trainers',
      icon: 'trainer'
    },
    {
      title: 'Memberships',
      href: '/memberships',
      icon: 'membership'
    },
    {
      title: 'Payments',
      href: '/payments',
      icon: 'payment'
    },
    {
      title: 'Attendance',
      href: '/attendance',
      icon: 'attendance'
    },
    {
      title: 'Reports',
      href: '/reports',
      icon: 'reports'
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: 'settings'
    }
  ]
};
