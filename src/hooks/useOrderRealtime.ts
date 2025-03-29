
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Order } from '@/services/order';

/**
 * Custom hook to handle real-time updates for orders
 * @returns An object containing real-time order data and connection status
 */
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
    
    // Subscribe to real-time changes on the orders table
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        (payload) => {
          console.log('Real-time update received:', payload);
          setIsConnected(true);
          
          // Extract basic order details for display
          const orderId = payload.new?.id || payload.old?.id;
          const orderIdDisplay = orderId ? orderId.slice(0, 8) : 'Unknown';
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: 'New Order Received',
              description: `Order #${orderIdDisplay} has been placed.`,
            });
            setLastUpdate({
              type: 'INSERT',
              order: payload.new,
              timestamp: new Date()
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: 'Order Updated',
              description: `Order #${orderIdDisplay} has been updated to "${payload.new.status}".`,
            });
            setLastUpdate({
              type: 'UPDATE',
              order: payload.new,
              timestamp: new Date()
            });
          } else if (payload.eventType === 'DELETE') {
            toast({
              title: 'Order Deleted',
              description: `Order #${orderIdDisplay} has been removed.`,
            });
            setLastUpdate({
              type: 'DELETE',
              order: payload.old,
              timestamp: new Date()
            });
          }
          
          // Invalidate the orders query to trigger a refetch
          queryClient.invalidateQueries({ queryKey: ['orders'] });
        })
      .subscribe((status) => {
        console.log('Subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    console.log('Subscribed to real-time updates for orders table');

    // Clean up subscription when component unmounts
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
