'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  memberships: Array<{
    id: string;
    startDate: string;
    endDate: string;
    amount: number;
  }>;
  gym?: {
    id: string;
    name: string;
  };
}

interface CheckInResponse {
  message?: string;
  error?: string;
  data?: {
    id: string;
    memberId: string;
    checkIn: string;
    member: {
      firstName: string;
      lastName: string;
    };
  };
}

export default function NewCheckInPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const searchMembers = async (query: string) => {
    if (!query.trim()) {
      setMembers([]);
      return;
    }

    try {
      setSearchLoading(true);
      const res = await fetch(`/api/members/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to search members');
      }

      setMembers(data);
      setError('');
    } catch (err) {
      setError('Failed to search members');
      setMembers([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const canCheckIn = (member: Member) => {
    if (member.status !== 'ACTIVE') return false;
    
    // Check if member has a valid membership
    const currentDate = new Date();
    const latestMembership = member.memberships?.[0]; // Add optional chaining
    return latestMembership && new Date(latestMembership.endDate) > currentDate;
  };

  const handleCheckIn = async (memberId: string) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberId }),
      });

      const data: CheckInResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Check-in failed');
      }

      if (data.data?.member) {
        setSuccess(
          `Check-in recorded successfully for ${data.data.member.firstName} ${data.data.member.lastName}`
        );
      } else {
        setSuccess('Check-in recorded successfully');
      }
      
      setSearchQuery('');
      setMembers([]);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Check-in failed');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const getMembershipStatus = (member: Member) => {
    const currentDate = new Date();
    const latestMembership = member.memberships?.[0];
    
    if (!latestMembership) {
      return 'No Membership';
    }
    
    const endDate = new Date(latestMembership.endDate);
    return endDate > currentDate ? 'Active' : 'Expired';
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Record Check-in</h1>

      {/* Search Input */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {searchLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            searchMembers(e.target.value);
          }}
          placeholder="Search members by name or email..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded bg-green-50 text-green-600 text-sm">
          {success}
        </div>
      )}

      {/* Members List */}
      {searchLoading ? (
        <div className="text-center text-gray-500">Searching...</div>
      ) : (
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {member.firstName} {member.lastName}
                </h3>
                <p className="text-xs text-gray-500">{member.email}</p>
                {member.gym && (
                  <p className="text-xs text-gray-500 mt-1">
                    Gym: {member.gym.name}
                  </p>
                )}
                <div className="flex gap-2 mt-1">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      member.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    Status: {member.status}
                  </span>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      getMembershipStatus(member) === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : getMembershipStatus(member) === 'Expired'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    Membership: {getMembershipStatus(member)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleCheckIn(member.id)}
                disabled={loading || !canCheckIn(member)}
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Checking in...
                  </>
                ) : (
                  'Check In'
                )}
              </button>
            </div>
          ))}
          {members.length === 0 && searchQuery && !searchLoading && (
            <div className="text-center text-gray-500">No members found</div>
          )}
        </div>
      )}
    </div>
  );
} 