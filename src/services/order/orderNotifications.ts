
import { supabase } from '@/integrations/supabase/client';
import { Order } from './orderTypes';
import { toast } from '@/hooks/use-toast';
import type { Notification } from '@/types/notification';

export const setupOrderNotifications = (addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void) => {
  const channel = supabase
    .channel('public:orders')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'orders' },
      (payload) => {
        const newOrder = payload.new as Order;
        const orderIdDisplay = newOrder.id ? String(newOrder.id).slice(0, 8) : 'Unknown';
        
        // Show toast notification
        toast({
          title: "New Order Received",
          description: `Order #${orderIdDisplay} has been placed.`,
          duration: 5000,
        });

        // Add to notifications panel
        addNotification({
          title: 'New Order Received',
          description: `Order #${orderIdDisplay} has been placed.`,
          type: 'order',
          link: `/order-detail?id=${newOrder.id}`
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
