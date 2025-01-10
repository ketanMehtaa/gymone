'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider
} from '@/components/ui/sidebar';
import { navItems } from '@/constants/data';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export const company = {
  name: 'GymPro',
  logo: '/logo.png'
};

export function AppSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className='flex h-[60px] items-center px-6'>
            <img src={company.logo} alt={company.name} className='h-6' />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
              {navItems.map((item, index) => (
                <Link key={index} href={item.href} passHref>
                  <SidebarMenuItem
                    className={`cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                      pathname === item.href
                        ? 'bg-accent text-accent-foreground'
                        : ''
                    }`}
                    active={pathname === item.href}
                  >
                    {item.icon}
                    {item.label}
                  </SidebarMenuItem>
                </Link>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className='flex h-[60px] items-center gap-2 px-6'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className='flex cursor-pointer items-center gap-2'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
                    <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium'>{user.name}</span>
                    <span className='text-xs text-gray-500'>{user.email}</span>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className='mr-2 h-4 w-4' />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
