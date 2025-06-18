
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase, checkSupabaseConnection } from '@/integrations/supabase/client';
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
    
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    let reconnectTimeout: NodeJS.Timeout;
    
    // Check initial connection
    const checkInitialConnection = async () => {
      const connectionOk = await checkSupabaseConnection();
      if (!connectionOk) {
        console.warn('Initial Supabase connection failed');
        toast({
          title: "Connection Warning",
          description: "Unable to establish database connection. Retrying...",
          variant: "destructive"
        });
      }
    };
    
    // Handle reconnection with exponential backoff
    const attemptReconnect = () => {
      if (reconnectAttempts >= maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        toast({
          title: "Connection Failed",
          description: "Unable to establish realtime connection after multiple attempts.",
          variant: "destructive"
        });
        return;
      }
      
      reconnectAttempts++;
      const delay = Math.pow(2, reconnectAttempts) * 1000; // Exponential backoff
      
      console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts}) in ${delay}ms`);
      setIsConnected(false);
      
      reconnectTimeout = setTimeout(() => {
        setupSubscription();
      }, delay);
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
              reconnectAttempts = 0; // Reset on successful message
              
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
              reconnectAttempts = 0; // Reset on successful subscription
            } else if (status === 'CHANNEL_ERROR') {
              console.error('Channel error, will attempt reconnect');
              setIsConnected(false);
              attemptReconnect();
            } else if (status === 'TIMED_OUT') {
              console.error('Subscription timed out, will attempt reconnect');
              setIsConnected(false);
              attemptReconnect();
            } else if (status === 'CLOSED') {
              console.log('Channel closed');
              setIsConnected(false);
            } else {
              setIsConnected(status === 'SUBSCRIBED');
            }
          });

        return channel;
      } catch (error) {
        console.error('Error setting up Supabase realtime:', error);
        attemptReconnect();
        return null;
      }
    };
    
    // Initialize
    checkInitialConnection();
    const channel = setupSubscription();
    
    // Cleanup function
    return () => {
      console.log('Cleaning up real-time subscription');
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
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
