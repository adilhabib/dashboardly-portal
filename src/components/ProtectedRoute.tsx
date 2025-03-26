
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { Loader2 } from 'lucide-react';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const location = useLocation();
  
  const isLoading = authLoading || adminLoading;

  useEffect(() => {
    console.log('ProtectedRoute - Auth status:', {
      user: user ? `logged in as ${user.email}` : 'not logged in',
      userId: user?.id,
      authLoading,
      isAdmin,
      adminLoading,
      path: location.pathname
    });
  }, [user, authLoading, isAdmin, adminLoading, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <span className="text-lg">Loading authentication status...</span>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    console.log('User not admin, redirecting to /unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
