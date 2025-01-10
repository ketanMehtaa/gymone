import { BarChart3, Users, CreditCard, Settings } from 'lucide-react';
import { ReactNode } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

export const navItems: NavItem[] = [
  {
    label: 'Overview',
    href: '/',
    icon: <BarChart3 className='h-4 w-4' />
  },
  {
    label: 'Members',
    href: '/members',
    icon: <Users className='h-4 w-4' />
  },
  {
    label: 'Memberships',
    href: '/memberships',
    icon: <CreditCard className='h-4 w-4' />
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className='h-4 w-4' />
  }
];
