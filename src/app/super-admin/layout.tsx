'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, LogOut } from 'lucide-react';

const navigation = [
  { name: 'Gyms', href: '/super-admin/gyms', icon: Building2 },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/super-admin/gyms" className="text-xl font-bold text-indigo-600">
              GymOne Admin
            </Link>
          </div>
          <nav className="mt-5 flex-1 flex flex-col divide-y divide-gray-200 overflow-y-auto" aria-label="Sidebar">
            <div className="px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <Icon className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Logout button */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="w-6 h-6 mr-3 text-gray-400" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <main className="flex-1">{children}</main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 flex z-40">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />

            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg
                    className="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <span className="text-xl font-bold text-indigo-600">GymOne Admin</span>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="flex-shrink-0 p-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-2 py-2 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                >
                  <LogOut className="w-6 h-6 mr-3 text-gray-400" />
                  Logout
                </button>
              </div>
            </div>

            <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
          </div>
        </div>
      )}
    </div>
  );
} 