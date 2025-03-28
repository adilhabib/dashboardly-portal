
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Custom hook to handle real-time updates for orders
 */
export const useOrderRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        (payload) => {
          console.log('Real-time update received:', payload);
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: 'New Order Received',
              description: `Order #${payload.new.id.slice(0, 8)} has been placed.`,
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: 'Order Updated',
              description: `Order #${payload.new.id.slice(0, 8)} has been updated to "${payload.new.status}".`,
            });
          } else if (payload.eventType === 'DELETE') {
            toast({
              title: 'Order Deleted',
              description: `Order #${payload.old.id.slice(0, 8)} has been removed.`,
            });
          }
          
          queryClient.invalidateQueries({ queryKey: ['orders'] });
        })
      .subscribe();

    console.log('Subscribed to real-time updates for orders table');

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
