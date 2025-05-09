
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/services/order';
import { toast } from '@/hooks/use-toast';

export const useOrderRealtime = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<{
    type: 'INSERT' | 'UPDATE' | 'DELETE' | null;
    order: Partial<Order> | null;
    timestamp: Date | null;
  }>({
    type: null,
    order: null,
    timestamp: null
  });

  useEffect(() => {
    console.log('Setting up real-time subscription for orders table');
    
    // Handle reconnection
    const attemptReconnect = () => {
      console.log('Attempting to reconnect to Supabase realtime');
      setIsConnected(false);
      setupSubscription();
    };
    
    // Setup the subscription
    const setupSubscription = () => {
      try {
        const channel = supabase
          .channel('public:orders')
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'orders' }, 
            (payload) => {
              console.log('Real-time update received:', payload);
              setIsConnected(true);
              
              // Extract basic order details for display
              const newRecord = payload.new as Record<string, any> | null;
              const oldRecord = payload.old as Record<string, any> | null;
              
              // Safely access the ID
              const orderId = newRecord?.id || oldRecord?.id;
              
              if (payload.eventType === 'INSERT') {
                setLastUpdate({
                  type: 'INSERT',
                  order: newRecord ? newRecord as Partial<Order> : null,
                  timestamp: new Date()
                });
                toast({
                  title: "New Order",
                  description: `Order #${orderId ? String(orderId).slice(0, 8) : 'Unknown'} has been created`,
                });
              } else if (payload.eventType === 'UPDATE') {
                setLastUpdate({
                  type: 'UPDATE',
                  order: newRecord ? newRecord as Partial<Order> : null,
                  timestamp: new Date()
                });
              } else if (payload.eventType === 'DELETE') {
                setLastUpdate({
                  type: 'DELETE',
                  order: oldRecord ? oldRecord as Partial<Order> : null,
                  timestamp: new Date()
                });
              }
              
              // Invalidate the orders query to trigger a refetch
              queryClient.invalidateQueries({ queryKey: ['orders'] });
            })
          .subscribe((status) => {
            console.log('Subscription status:', status);
            if (status === 'SUBSCRIBED') {
              console.log('Successfully subscribed to realtime updates');
              setIsConnected(true);
            } else if (status === 'CHANNEL_ERROR') {
              console.error('Channel error, will attempt reconnect');
              setIsConnected(false);
              setTimeout(attemptReconnect, 5000);
            } else if (status === 'TIMED_OUT') {
              console.error('Connection timed out, will attempt reconnect');
              setIsConnected(false);
              setTimeout(attemptReconnect, 5000);
            } else {
              // Use string literals for status comparison
              setIsConnected(status === 'SUBSCRIBED');
            }
          });

        return channel;
      } catch (error) {
        console.error('Error setting up Supabase realtime:', error);
        setTimeout(attemptReconnect, 5000);
        return null;
      }
    };
    
    // Initial setup
    const channel = setupSubscription();
    
    // Perform a test query to verify the connection
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('count(*)', { count: 'exact', head: true });
        
        if (error) {
          console.error('Error checking connection:', error);
          toast({
            title: "Connection Error",
            description: "Unable to connect to the database. Retrying in background...",
            variant: "destructive"
          });
          setTimeout(checkConnection, 10000); // Retry after 10 seconds
        } else {
          console.log('Database connection successful');
          setIsConnected(true);
        }
      } catch (err) {
        console.error('Failed to check connection:', err);
        setTimeout(checkConnection, 10000); // Retry after 10 seconds
      }
    };
    
    checkConnection();
    
    // Cleanup function
    return () => {
      console.log('Cleaning up real-time subscription');
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [queryClient]);

  return {
    isConnected,
    lastUpdate
  };
};
