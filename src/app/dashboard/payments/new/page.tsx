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
    status: string;
  }>;
}

export default function NewPaymentPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembership, setSelectedMembership] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
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

      // Ensure memberships is always an array
      const membersWithSafeMemberships = data.map((member: Member) => ({
        ...member,
        memberships: member.memberships || []
      }));

      setMembers(membersWithSafeMemberships);
      setError('');
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search members');
      setMembers([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMembership || !amount || !paymentMethod) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          membershipId: selectedMembership,
          amount: parseFloat(amount),
          method: paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      setSuccess('Payment recorded successfully');
      setSelectedMembership('');
      setAmount('');
      setPaymentMethod('CASH');
      setSearchQuery('');
      setMembers([]);
      
      // Redirect to payments list after successful payment
      setTimeout(() => {
        router.push('/dashboard/payments');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Record Payment</h1>

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
      <div className="space-y-4 mb-6">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="mb-3">
              <h3 className="text-sm font-medium text-gray-900">
                {member.firstName} {member.lastName}
              </h3>
              <p className="text-xs text-gray-500">{member.email}</p>
              <span className={`inline-block px-2 py-1 mt-1 text-xs rounded-full ${
                member.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {member.status}
              </span>
            </div>
            
            {member.memberships && member.memberships.length > 0 ? (
              <div className="space-y-2">
                {member.memberships.map((membership) => (
                  <div
                    key={membership.id}
                    className="p-3 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">
                          Valid: {new Date(membership.startDate).toLocaleDateString()} - {new Date(membership.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          Amount: ${typeof membership.amount === 'string' ? parseFloat(membership.amount).toFixed(2) : membership.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Status: {membership.status}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedMembership(membership.id)}
                        disabled={membership.status !== 'ACTIVE'}
                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                          selectedMembership === membership.id
                            ? 'bg-indigo-600 text-white'
                            : membership.status !== 'ACTIVE'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
                        }`}
                      >
                        {selectedMembership === membership.id ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500">No active memberships found</p>
                {member.status === 'ACTIVE' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Create a membership first to record payments
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Payment Form */}
      {selectedMembership && (
        <form onSubmit={handlePayment} className="space-y-4 bg-white rounded-lg shadow p-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <div className="mt-1">
              <input
                type="number"
                step="0.01"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="CASH">Cash</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="DEBIT_CARD">Debit Card</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="UPI">UPI</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Record Payment'
            )}
          </button>
        </form>
      )}
    </div>
  );
} 