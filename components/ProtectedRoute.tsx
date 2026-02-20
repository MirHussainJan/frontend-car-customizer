'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode;
  requiredRole?: 'admin' | 'client';
}) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not authenticated, redirect to login
        router.push('/login');
      } else if (requiredRole && user.role !== requiredRole) {
        // Authenticated but wrong role
        if (user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }
    }
  }, [user, loading, requiredRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
