
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/services/order';
import { useNotifications } from '@/contexts/NotificationContext';

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
        // Update connection status based on subscription status
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Perform a test query to verify the subscription is working
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('count(*)', { count: 'exact', head: true });
        
        if (error) {
          console.error('Error checking connection:', error);
          setIsConnected(false);
        } else {
          console.log('Database connection successful');
          // The connection is established but we'll let the subscription
          // callback handle the actual realtime connection status
        }
      } catch (err) {
        console.error('Failed to check connection:', err);
        setIsConnected(false);
      }
    };
    
    checkConnection();
    console.log('Subscribed to real-time updates for orders table');

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    isConnected,
    lastUpdate
  };
};
