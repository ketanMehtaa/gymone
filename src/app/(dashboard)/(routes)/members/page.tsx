'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Plus, Search, UserPlus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  membershipStatus: string;
  endDate: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/members');

      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }

      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
      setError('Failed to load members. Please try again later.');
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery)
  );

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Members</h2>
          <p className='mt-2 text-muted-foreground'>
            Manage your gym members and their memberships
          </p>
        </div>
        <Link href='/members/new'>
          <Button size='sm' className='h-10'>
            <UserPlus className='mr-2 h-4 w-4' />
            Add New Member
          </Button>
        </Link>
      </div>

      <Card className='overflow-hidden'>
        <CardHeader className='bg-muted/50 py-4'>
          <div className='flex items-center justify-between'>
            <CardTitle>Member Management</CardTitle>
            <div className='flex items-center gap-4'>
              <div className='relative w-64'>
                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search members...'
                  className='pl-8'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          {loading ? (
            <div className='flex items-center justify-center py-8'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            </div>
          ) : error ? (
            <div className='flex flex-col items-center justify-center py-8 text-center'>
              <p className='mb-4 text-red-500'>{error}</p>
              <Button onClick={fetchMembers}>Try Again</Button>
            </div>
          ) : members.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-8 text-center'>
              <UserPlus className='mb-4 h-8 w-8 text-muted-foreground' />
              <h3 className='text-lg font-semibold'>No members found</h3>
              <p className='mb-4 text-muted-foreground'>
                Get started by adding your first member
              </p>
              <Link href='/members/new'>
                <Button>
                  <Plus className='mr-2 h-4 w-4' />
                  Add New Member
                </Button>
              </Link>
            </div>
          ) : (
            <div className='relative overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow className='bg-muted/50'>
                    <TableHead className='font-semibold'>Name</TableHead>
                    <TableHead className='font-semibold'>Email</TableHead>
                    <TableHead className='font-semibold'>Phone</TableHead>
                    <TableHead className='font-semibold'>Membership</TableHead>
                    <TableHead className='font-semibold'>Status</TableHead>
                    <TableHead className='font-semibold'>End Date</TableHead>
                    <TableHead className='font-semibold'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className='py-8 text-center'>
                        <p className='text-muted-foreground'>
                          No members found matching your search
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((member) => (
                      <TableRow key={member.id} className='hover:bg-muted/50'>
                        <TableCell className='font-medium'>
                          {member.name}
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.phone}</TableCell>
                        <TableCell>
                          <span className='inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10'>
                            {member.membershipType}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                              member.membershipStatus === 'ACTIVE'
                                ? 'bg-green-50 text-green-700 ring-green-600/20'
                                : member.membershipStatus === 'PENDING'
                                ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                                : 'bg-red-50 text-red-700 ring-red-600/20'
                            }`}
                          >
                            {member.membershipStatus}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(member.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Link href={`/members/${member.id}`}>
                            <Button variant='ghost' size='sm' className='h-8'>
                              View Details
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
