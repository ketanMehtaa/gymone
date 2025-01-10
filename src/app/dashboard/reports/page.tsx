'use client';

import { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  CreditCardIcon,
  CalendarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ReportStats {
  membershipsByType: {
    type: string;
    count: number;
  }[];
  revenueByMonth: {
    month: string;
    amount: number;
  }[];
  checkInsByDay: {
    date: string;
    count: number;
  }[];
  membershipStatus: {
    status: string;
    count: number;
  }[];
  paymentMethods: {
    method: string;
    count: number;
    amount: number;
  }[];
  hourlyAttendance: {
    hour: string;
    count: number;
  }[];
  membershipTrend: Record<string, { new: number; cancelled: number }>;
}

export default function ReportsPage() {
  const [stats, setStats] = useState<ReportStats>({
    membershipsByType: [],
    revenueByMonth: [],
    checkInsByDay: [],
    membershipStatus: [],
    paymentMethods: [],
    hourlyAttendance: [],
    membershipTrend: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/reports/stats');
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch report stats');
        }
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching report stats:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Reports & Analytics</h1>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-gray-200 rounded-full mr-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Reports & Analytics</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    );
  }

  // Transform membership trend data for chart
  const membershipTrendData = Object.entries(stats.membershipTrend).map(([month, data]) => ({
    name: month,
    new: data.new,
    cancelled: data.cancelled,
    net: data.new - data.cancelled,
  }));

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatNumber = (value: number) => value.toLocaleString();

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Reports & Analytics</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  total: {
                    theme: {
                      light: "hsl(var(--primary))",
                      dark: "hsl(var(--primary))",
                    },
                  },
                }}
              >
                <LineChart
                  data={stats.revenueByMonth.map(item => ({
                    name: item.month,
                    total: item.amount
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Line
                    type="monotone"
                    dataKey="total"
                    strokeWidth={2}
                    activeDot={{
                      r: 6,
                    }}
                  />
                  <ChartTooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelClassName="font-medium"
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Check-ins */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  total: {
                    theme: {
                      light: "hsl(var(--primary))",
                      dark: "hsl(var(--primary))",
                    },
                  },
                }}
              >
                <BarChart
                  data={stats.checkInsByDay.map(item => ({
                    name: item.date,
                    total: item.count
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatNumber} />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]} />
                  <ChartTooltip 
                    formatter={(value: number) => formatNumber(value)}
                    labelClassName="font-medium"
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Membership Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Member Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  total: {
                    theme: {
                      light: "hsl(var(--primary))",
                      dark: "hsl(var(--primary))",
                    },
                  },
                }}
              >
                <BarChart
                  data={stats.membershipStatus.map(item => ({
                    name: item.status,
                    total: item.count
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatNumber} />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]} />
                  <ChartTooltip 
                    formatter={(value: number) => formatNumber(value)}
                    labelClassName="font-medium"
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  total: {
                    theme: {
                      light: "hsl(var(--primary))",
                      dark: "hsl(var(--primary))",
                    },
                  },
                }}
              >
                <BarChart
                  data={stats.paymentMethods.map(item => ({
                    name: item.method.replace('_', ' '),
                    total: item.amount
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]} />
                  <ChartTooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelClassName="font-medium"
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Hourly Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Hourly Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  total: {
                    theme: {
                      light: "hsl(var(--primary))",
                      dark: "hsl(var(--primary))",
                    },
                  },
                }}
              >
                <BarChart
                  data={stats.hourlyAttendance.map(item => ({
                    name: item.hour,
                    total: item.count
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatNumber} />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]} />
                  <ChartTooltip 
                    formatter={(value: number) => formatNumber(value)}
                    labelClassName="font-medium"
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Membership Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Membership Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  new: {
                    theme: {
                      light: "hsl(var(--success))",
                      dark: "hsl(var(--success))",
                    },
                  },
                  cancelled: {
                    theme: {
                      light: "hsl(var(--destructive))",
                      dark: "hsl(var(--destructive))",
                    },
                  },
                  net: {
                    theme: {
                      light: "hsl(var(--primary))",
                      dark: "hsl(var(--primary))",
                    },
                  },
                }}
              >
                <LineChart data={membershipTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatNumber} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="new"
                    name="New Members"
                    strokeWidth={2}
                    activeDot={{
                      r: 6,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cancelled"
                    name="Cancelled"
                    strokeWidth={2}
                    activeDot={{
                      r: 6,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="net"
                    name="Net Growth"
                    strokeWidth={2}
                    activeDot={{
                      r: 6,
                    }}
                  />
                  <ChartTooltip 
                    formatter={(value: number) => formatNumber(value)}
                    labelClassName="font-medium"
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 