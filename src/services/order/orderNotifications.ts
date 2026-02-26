
import { supabase } from '@/integrations/supabase/client';
import { Order } from './orderTypes';
import { toast } from '@/hooks/use-toast';
import type { Notification } from '@/types/notification';
import AIService from '@/services/aiService';

export const setupOrderNotifications = (addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void) => {
  const channel = supabase
    .channel('public:orders')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'orders' },
      async (payload) => {
        const newOrder = payload.new as Order;
        const orderIdDisplay = newOrder.id ? String(newOrder.id).slice(0, 8) : 'Unknown';
        const originalTitle = 'New Order Received';
        const originalBody = `Order #${orderIdDisplay} has been placed.`;
        const rewritten = await AIService.rewriteNotification(originalTitle, originalBody);
        
        // Show toast notification
        toast({
          title: rewritten.title,
          description: rewritten.body,
          duration: 5000,
        });

        // Add to notifications panel
        addNotification({
          title: rewritten.title,
          description: rewritten.body,
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
