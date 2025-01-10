'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider - Checking auth state');
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('AuthProvider - Making /api/auth/me request');
      const response = await fetch('/api/auth/me');
      console.log(
        'AuthProvider - /api/auth/me response status:',
        response.status
      );

      if (response.ok) {
        const data = await response.json();
        console.log('AuthProvider - User data:', data.user);
        setUser(data.user);
      } else {
        console.log('AuthProvider - No user found or unauthorized');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthProvider - Attempting login');
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      console.log('AuthProvider - Login response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      console.log('AuthProvider - Login successful, user:', data.user);
      setUser(data.user);
      await checkAuth(); // Refresh auth state after login
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('AuthProvider - Attempting logout');
      setLoading(true);
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      });

      if (response.ok) {
        console.log('AuthProvider - Logout successful');
        setUser(null);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
