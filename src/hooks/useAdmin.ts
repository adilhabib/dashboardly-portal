
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
        // Use a more direct approach with custom query instead of RPC
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
        setIsAdmin(!!data);
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
