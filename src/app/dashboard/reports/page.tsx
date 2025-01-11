import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';

interface StatsData {
  membershipTrend: Array<{
    month: string;
    total: number;
  }>;
  attendanceTrend: Array<{
    month: string;
    total: number;
  }>;
  memberStatusDistribution: Array<{
    status: string;
    total: number;
  }>;
}

async function getStats(): Promise<StatsData> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/reports/stats`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch stats');
  }

  return res.json();
}

function ReportsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default async function ReportsPage() {
  const stats = await getStats();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
      </div>

      <Suspense fallback={<ReportsLoading />}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Membership Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Membership Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={stats.membershipTrend.map(item => ({
                  name: item.month,
                  value: item.total,
                }))}
              />
            </CardContent>
          </Card>

          {/* Attendance Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={stats.attendanceTrend.map(item => ({
                  name: item.month,
                  value: item.total,
                }))}
              />
            </CardContent>
          </Card>

          {/* Member Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Member Status</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                data={stats.memberStatusDistribution.map(item => ({
                  name: item.status,
                  value: item.total,
                }))}
              />
            </CardContent>
          </Card>
        </div>
      </Suspense>
    </div>
  );
} 