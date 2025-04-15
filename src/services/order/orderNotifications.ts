
import { supabase } from '@/integrations/supabase/client';
import { Order } from './orderTypes';
import { toast } from '@/hooks/use-toast';

export const setupOrderNotifications = () => {
  const channel = supabase
    .channel('public:orders')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'orders' },
      (payload) => {
        const newOrder = payload.new as Order;
        const orderIdDisplay = newOrder.id ? String(newOrder.id).slice(0, 8) : 'Unknown';
        
        toast({
          title: "New Order Received",
          description: `Order #${orderIdDisplay} has been placed.`,
          duration: 5000,
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
