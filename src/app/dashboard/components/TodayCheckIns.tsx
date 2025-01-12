'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface CheckIn {
  id: string;
  checkIn: string;
  member: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export default function TodayCheckIns() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTodayCheckIns = async () => {
      try {
        const response = await fetch('/api/attendance/today');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch check-ins');
        }

        setCheckIns(data);
      } catch (err) {
        setError('Failed to load today\'s check-ins');
        console.error('Error fetching check-ins:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayCheckIns();
    // Refresh every minute
    const interval = setInterval(fetchTodayCheckIns, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Check-ins</h2>
        <p className="text-sm text-gray-500 mt-1">
          {checkIns.length} member{checkIns.length !== 1 ? 's' : ''} checked in today
        </p>
      </div>
      <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
        {checkIns.length === 0 ? (
          <p className="p-4 text-sm text-gray-500 text-center">
            No check-ins recorded today
          </p>
        ) : (
          checkIns.map((checkIn) => (
            <Link
              key={checkIn.id}
              href={`/dashboard/members/${checkIn.member.id}`}
              className="block hover:bg-gray-50 transition-colors"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {checkIn.member.firstName} {checkIn.member.lastName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(checkIn.checkIn), 'h:mm a')}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
} 