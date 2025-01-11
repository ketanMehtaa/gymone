'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';
import { CalendarIcon, Loader2, ArrowLeft } from 'lucide-react';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  membershipStatus: 'ACTIVE' | 'EXPIRED' | 'NONE';
  latestMembership?: {
    endDate: string;
  };
}

export default function NewMembershipPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [duration, setDuration] = useState<string>('1');
  const [amount, setAmount] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [error, setError] = useState('');

  // Fetch member if memberId is provided in URL
  useEffect(() => {
    const memberId = searchParams.get('memberId');
    if (memberId) {
      fetchMember(memberId).then((member) => {
        if (member) {
          setSelectedMember(member);
          setSearchQuery(`${member.firstName || ''} ${member.lastName || ''}`.trim());
        }
      });
    }
  }, [searchParams]);

  const fetchMember = async (memberId: string) => {
    setInitialLoading(true);
    try {
      const res = await fetch(`/api/members/${memberId}`);
      if (!res.ok) throw new Error('Failed to fetch member');
      const data = await res.json();
      return data.member;
    } catch (error) {
      console.error('Fetch member error:', error);
      toast.error('Failed to fetch member details');
      return null;
    } finally {
      setInitialLoading(false);
    }
  };

  // Search members
  const searchMembers = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(`/api/members/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to search members');
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search members');
    }
  };

  // Handle member selection
  const handleMemberSelect = (member: Member) => {
    setSelectedMember(member);
    setSearchQuery(`${member.firstName} ${member.lastName}`);
    setSearchResults([]);
  };

  // Create membership
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const memberId = searchParams.get('memberId') || selectedMember?.id;

    if (!memberId) {
      setError('Please select a member');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!startDate) {
      setError('Please select a start date');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/memberships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          duration: parseInt(duration),
          amount: parseFloat(amount),
          startDate: startDate.toISOString(),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create membership');
      }

      toast.success('Membership created successfully');
      router.push('/dashboard/memberships');
      router.refresh();
    } catch (error) {
      console.error('Submit error:', error);
      setError(error instanceof Error ? error.message : 'Failed to create membership');
      toast.error(error instanceof Error ? error.message : 'Failed to create membership');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Membership</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membership Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Member Selection Section */}
            <div className="space-y-4">
              {selectedMember ? (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Selected Member</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedMember.membershipStatus === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : selectedMember.membershipStatus === 'EXPIRED'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedMember.membershipStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Name: {selectedMember.firstName} {selectedMember.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: {selectedMember.email}
                  </p>
                  {selectedMember.membershipStatus === 'EXPIRED' && selectedMember.latestMembership && (
                    <p className="text-sm text-yellow-600 mt-1">
                      Last membership expired on: {format(new Date(selectedMember.latestMembership.endDate), 'PP')}
                    </p>
                  )}
                </div>
              ) : !searchParams.get('memberId') && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Member
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        searchMembers(e.target.value);
                      }}
                      placeholder="Search by name or email"
                      className="w-full"
                    />
                    {searchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border">
                        <ul className="py-1">
                          {searchResults.map((member) => (
                            <li
                              key={member.id}
                              onClick={() => handleMemberSelect(member)}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              <div>
                                <div className="flex items-center justify-between">
                                  <span>{member.firstName} {member.lastName}</span>
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                  </span>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {member.email}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Duration Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Duration (months)
                </label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {month} {month === 1 ? 'month' : 'months'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
            </div>

            {/* Start Date Picker */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Membership...
                </>
              ) : (
                'Create Membership'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 