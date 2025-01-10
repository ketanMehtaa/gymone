'use client';

import Link from 'next/link';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/components/user-avatar';
import { Icons } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';

interface SiteHeaderProps {
  user: Pick<User, 'name' | 'image' | 'email'>;
}

export function SiteHeader({ user }: SiteHeaderProps) {
  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background'>
      <div className='container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0'>
        <div className='flex gap-6 md:gap-10'>
          <Link href='/' className='flex items-center space-x-2'>
            <Icons.logo className='h-6 w-6' />
            <span className='inline-block font-bold'>GymPro</span>
          </Link>
        </div>
        <div className='flex flex-1 items-center justify-end space-x-4'>
          <nav className='flex items-center space-x-2'>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <UserAvatar
                  user={{ name: user.name || null, image: user.image || null }}
                  className='h-8 w-8'
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <div className='flex items-center justify-start gap-2 p-2'>
                  <div className='flex flex-col space-y-1 leading-none'>
                    {user.name && <p className='font-medium'>{user.name}</p>}
                    {user.email && (
                      <p className='w-[200px] truncate text-sm text-muted-foreground'>
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href='/dashboard'>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href='/settings'>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className='cursor-pointer'
                  onSelect={(event) => {
                    event.preventDefault();
                    signOut({
                      callbackUrl: `${window.location.origin}/sign-in`
                    });
                  }}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
