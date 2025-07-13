"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../../components/admin/AdminSidebar';

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    
    if (!token) {
      router.push('/admin/login');
      return;
    }

    setIsAuthenticated(true);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto lg:ml-0">
        <div className="p-8 lg:pl-8">
          {children}
        </div>
      </main>
    </div>
  );
}