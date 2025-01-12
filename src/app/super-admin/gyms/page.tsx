'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

interface Gym {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  admin: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function SuperAdminGymsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPassword: '',
  });

  useEffect(() => {
    fetchGyms();
  }, []);

  const fetchGyms = async () => {
    try {
      const response = await fetch('/api/gyms');
      if (!response.ok) throw new Error('Failed to fetch gyms');
      const data = await response.json();
      setGyms(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch gyms',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/gyms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create gym');

      toast({
        title: 'Success',
        description: 'Gym created successfully',
      });

      setShowForm(false);
      setFormData({
        name: '',
        email: '',
        address: '',
        phone: '',
        adminFirstName: '',
        adminLastName: '',
        adminEmail: '',
        adminPassword: '',
      });
      fetchGyms();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create gym',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Gyms</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create New Gym'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Create New Gym</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Gym Name</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter gym name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Gym Email</label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter gym email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter gym address"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter gym phone"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Admin First Name</label>
              <Input
                required
                value={formData.adminFirstName}
                onChange={(e) => setFormData({ ...formData, adminFirstName: e.target.value })}
                placeholder="Enter admin first name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Last Name</label>
              <Input
                required
                value={formData.adminLastName}
                onChange={(e) => setFormData({ ...formData, adminLastName: e.target.value })}
                placeholder="Enter admin last name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Email</label>
              <Input
                required
                type="email"
                value={formData.adminEmail}
                onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                placeholder="Enter admin email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Password</label>
              <Input
                required
                type="password"
                value={formData.adminPassword}
                onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                placeholder="Enter admin password"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Gym'}
          </Button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gym Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {gyms.map((gym) => (
              <tr key={gym.id}>
                <td className="px-6 py-4 whitespace-nowrap">{gym.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{gym.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{gym.address}</td>
                <td className="px-6 py-4 whitespace-nowrap">{gym.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {gym.admin.firstName} {gym.admin.lastName} ({gym.admin.email})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 