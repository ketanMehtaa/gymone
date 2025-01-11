'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UserGroupIcon,
  CalendarIcon,
  CreditCardIcon,
  ChartBarIcon,
  UserPlusIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import TodayCheckIns from './components/TodayCheckIns';

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  monthlyRevenue: number;
  checkInsToday: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeMembers: 0,
    monthlyRevenue: 0,
    checkInsToday: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (!res.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    fetchStats();
  }, []);

  const actions = [
    {
      name: 'New Member',
      description: 'Add a new member',
      href: '/dashboard/members/new',
      icon: UserPlusIcon,
    },
    {
      name: 'New Membership',
      description: 'Create a membership',
      href: '/dashboard/memberships/new',
      icon: CreditCardIcon,
    },
    {
      name: 'Check In',
      description: 'Record attendance',
      href: '/dashboard/attendance/new',
      icon: ClockIcon,
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Grid */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-4 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Members
                  </dt>
                  <dd className="text-base sm:text-lg font-medium text-gray-900">
                    {stats.totalMembers}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-4 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Members
                  </dt>
                  <dd className="text-base sm:text-lg font-medium text-gray-900">
                    {stats.activeMembers}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCardIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-4 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Revenue This Month
                  </dt>
                  <dd className="text-base sm:text-lg font-medium text-gray-900">
                    ${stats.monthlyRevenue.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-4 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Check-ins Today
                  </dt>
                  <dd className="text-base sm:text-lg font-medium text-gray-900">
                    {stats.checkInsToday}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {actions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="relative group bg-white p-4 sm:p-6 shadow rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div>
                  <span className="rounded-lg inline-flex p-2 sm:p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                    <action.icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-3 sm:mt-4">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">
                    {action.name}
                  </h3>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                    {action.description}
                  </p>
                </div>
                <span
                  className="absolute inset-0 rounded-lg ring-indigo-200 pointer-events-none transition-shadow duration-200 group-hover:ring-2"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Today's Check-ins */}
        <div>
          <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Today's Activity</h2>
          <TodayCheckIns />
        </div>
      </div>
    </div>
  );
} 