
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleReturnToLogin = () => {
    // Force sign out any existing session before redirecting to login
    // This prevents the redirect loop
    localStorage.removeItem('sb-xazssvfcifagxbibnxqs-auth-token');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-2xl mx-auto">
        <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-xl text-gray-600 mb-8">
          You don't have permission to access the admin dashboard. This area is restricted to administrators only.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={handleReturnToLogin}>
            Return to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
