
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function checkAdminRole() {
      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log('Checking admin role for user:', user.id);
        
        // Use a more reliable approach to query the user_roles table
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .eq('role', 'admin');

        if (error) throw error;
        
        // User is admin if we found at least one matching record
        const hasAdminRole = data && data.length > 0;
        console.log('Admin role check result:', hasAdminRole, data);
        
        setIsAdmin(hasAdminRole);
      } catch (err) {
        console.error('Error checking admin role:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdminRole();
  }, [user]);

  return { isAdmin, isLoading, error };
}
