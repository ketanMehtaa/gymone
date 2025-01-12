'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  latestMembership?: {
    id: string;
    startDate: string;
    endDate: string;
    amount: number;
  };
  membershipStatus: 'NONE' | 'EXPIRED' | 'ACTIVE';
}

export default function MembershipsPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/members/memberships');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch members');
      }

      setMembers(data);
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-md bg-red-50 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Memberships Overview</h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Members</h3>
          <p className="text-2xl font-semibold text-gray-900">{members.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Expired Memberships</h3>
          <p className="text-2xl font-semibold text-yellow-600">
            {members.filter(m => m.membershipStatus === 'EXPIRED').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Memberships</h3>
          <p className="text-2xl font-semibold text-green-600">
            {members.filter(m => m.membershipStatus === 'ACTIVE').length}
          </p>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Members List</h3>
          <p className="mt-1 text-sm text-gray-500">
            Prioritizing members with expired memberships
          </p>
        </div>
        <ul className="divide-y divide-gray-200">
          {members.map((member) => (
            <li key={member.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </h4>
                      <p className="text-sm text-gray-500">{member.email}</p>
                      <p className="text-sm text-gray-500">{member.phone}</p>
                    </div>
                  </div>
                  {member.latestMembership && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          member.membershipStatus === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : member.membershipStatus === 'EXPIRED'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {member.membershipStatus} Membership
                        </span>
                        {member.membershipStatus === 'EXPIRED' && (
                          <span className="inline-flex items-center text-xs text-yellow-600">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Expired on {format(new Date(member.latestMembership.endDate), 'PP')}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        <p>Period: {format(new Date(member.latestMembership.startDate), 'PP')} - {format(new Date(member.latestMembership.endDate), 'PP')}</p>
                        <p>Amount: {formatCurrency(member.latestMembership.amount)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 