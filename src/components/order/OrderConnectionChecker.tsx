
import React, { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OrderConnectionCheckerProps {
  isConnected: boolean;
  connectionAttempts: number;
  setConnectionAttempts: React.Dispatch<React.SetStateAction<number>>;
  refetch: () => void;
}

const OrderConnectionChecker: React.FC<OrderConnectionCheckerProps> = ({
  isConnected,
  connectionAttempts,
  setConnectionAttempts,
  refetch
}) => {
  useEffect(() => {
    // Initial data load
    refetch();

    // Connection status check
    const checkSupabaseConnection = async () => {
      try {
        console.log('Checking Supabase connection...');
        const { data, error } = await supabase.from('orders').select('count(*)', { count: 'exact', head: true });
        
        if (error) {
          console.error('Supabase connection check error:', error);
          setConnectionAttempts(prev => prev + 1);
          
          toast({
            title: "Connection Error",
            description: "Unable to connect to the database. Please refresh the page.",
            variant: "destructive"
          });
          
          // If we've tried more than 3 times, wait longer before trying again
          const waitTime = connectionAttempts > 3 ? 30000 : 10000;
          setTimeout(checkSupabaseConnection, waitTime);
        } else {
          console.log('Supabase connection successful');
          setConnectionAttempts(0);
        }
      } catch (err) {
        console.error('Failed to check connection:', err);
        setTimeout(checkSupabaseConnection, 10000);
      }
    };

    checkSupabaseConnection();
    
    // Set up periodic connection checks
    const connectionCheckInterval = setInterval(() => {
      if (!isConnected) {
        console.log('Periodic connection check: Realtime is disconnected');
        checkSupabaseConnection();
      }
    }, 30000); // Check every 30 seconds if disconnected

    return () => {
      clearInterval(connectionCheckInterval);
    };
  }, [refetch, isConnected, connectionAttempts, setConnectionAttempts]);

  return null; // This is a non-visual component
};

export default OrderConnectionChecker;
