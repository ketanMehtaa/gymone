'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import { Button } from "@/components/ui/button";

interface Membership {
  id: string;
  startDate: string;
  endDate: string;
  amount: number;
  createdAt: string;
  adminId: string | null;
  staffId: string | null;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'STAFF';
  } | null;
}

interface Attendance {
  id: string;
  checkIn: string;
  checkOut: string | null;
}

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  memberships: Membership[];
  attendances: Attendance[];
}

export default function MemberDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'memberships' | 'attendance'>('info');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchMemberDetails();
  }, [params.id]);

  const fetchMemberDetails = async () => {
    try {
      const res = await fetch(`/api/members/${params.id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch member details');
      }

      setMember(data.member);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch member details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/members/${params.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete member');
      }

      router.push('/dashboard/members');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete member');
      setShowDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <p>Loading member details...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-600">Error: {error || 'Member not found'}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Member Details: {member.firstName} {member.lastName}
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Button
              onClick={() => router.push(`/dashboard/members/${params.id}/edit`)}
              className="w-full sm:w-auto"
            >
              Edit Member
            </Button>
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              Delete Member
            </Button>
            <Button
              onClick={() => router.back()}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Go Back
            </Button>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-card-foreground mb-4">
                Delete Member
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to delete this member? This action cannot be undone.
                All related memberships and attendance records will also be deleted.
              </p>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  variant="secondary"
                  disabled={deleteLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card shadow rounded-lg overflow-hidden">
          <div className="border-b border-border">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-4 px-3 text-sm font-medium border-b-2 ${
                  activeTab === 'info'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveTab('memberships')}
                className={`flex-1 py-4 px-3 text-sm font-medium border-b-2 ${
                  activeTab === 'memberships'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                Memberships
              </button>
              <button
                onClick={() => setActiveTab('attendance')}
                className={`flex-1 py-4 px-3 text-sm font-medium border-b-2 ${
                  activeTab === 'attendance'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                Attendance
              </button>
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === 'info' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">First Name</h3>
                  <p className="mt-1 text-sm text-gray-900">{member.firstName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
                  <p className="mt-1 text-sm text-gray-900">{member.lastName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-sm text-gray-900">{member.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p className="mt-1 text-sm text-gray-900">{member.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1 text-sm text-gray-900">{member.status}</p>
                </div>
              </div>
            )}

            {activeTab === 'memberships' && (
              <div className="space-y-4 sm:space-y-6">
                {member.memberships.length === 0 ? (
                  <p className="text-sm text-gray-500">No membership records found.</p>
                ) : (
                  member.memberships.map((membership) => (
                    <div key={membership.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                          <p className="mt-1 text-sm text-gray-900">
                            {new Date(membership.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">End Date</h3>
                          <p className="mt-1 text-sm text-gray-900">
                            {new Date(membership.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                          <p className="mt-1 text-sm text-gray-900">
                            {formatCurrency(membership.amount)}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Created By</h3>
                          <p className="mt-1 text-sm text-gray-900">
                            {membership.createdBy 
                              ? `${membership.createdBy.firstName} ${membership.createdBy.lastName} (${membership.createdBy.role})`
                              : 'Unknown'}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                          <p className="mt-1 text-sm text-gray-900">
                            {new Date(membership.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-4">
                {member.attendances.length === 0 ? (
                  <p className="text-sm text-gray-500">No attendance records found.</p>
                ) : (
                  member.attendances.map((attendance) => (
                    <div key={attendance.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Check In</h3>
                          <p className="mt-1 text-sm text-gray-900">
                            {new Date(attendance.checkIn).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Check Out</h3>
                          <p className="mt-1 text-sm text-gray-900">
                            {attendance.checkOut
                              ? new Date(attendance.checkOut).toLocaleString()
                              : 'Not checked out'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 