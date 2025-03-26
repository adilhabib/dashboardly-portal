
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
        
        // Query the user_roles table directly with correct single() handling
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "No rows returned" error, which we handle separately
          console.error('Error in admin role query:', error);
          throw error;
        }
        
        // User is admin if we found a matching record
        const hasAdminRole = !!data;
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
