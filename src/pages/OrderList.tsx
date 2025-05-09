
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { toast } from '@/hooks/use-toast';
import { fetchOrders } from '@/services/order';
import { useOrderRealtime } from '@/hooks/useOrderRealtime';
import { OrderStatusFilter as StatusFilterType } from '@/components/order/OrderStatusFilter';
import { useNotifications } from '@/contexts/NotificationContext';
import { setupOrderNotifications } from '@/services/order/orderNotifications';
import { supabase } from '@/integrations/supabase/client';
import OrderHeader from '@/components/order/OrderHeader';
import OrderContent from '@/components/order/OrderContent';
import OrderErrorState from '@/components/order/OrderErrorState';
import OrderLoading from '@/components/order/OrderLoading';
import OrderConnectionChecker from '@/components/order/OrderConnectionChecker';

const OrderList = () => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  
  const { addNotification } = useNotifications();
  const { isConnected, lastUpdate } = useOrderRealtime();
  
  React.useEffect(() => {
    const cleanup = setupOrderNotifications(addNotification);
    return () => cleanup();
  }, [addNotification]);

  const { data: orders, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    staleTime: 1000 * 60,
    retry: 3,
    meta: {
      onError: (err: any) => {
        console.error('Error fetching orders:', err);
        toast({
          title: "Error Loading Orders",
          description: "Could not load orders. Please try refreshing.",
          variant: "destructive"
        });
      }
    }
  });

  React.useEffect(() => {
    console.log('Orders data in component:', orders);
    if (isError) {
      console.error('Error in useQuery:', error);
    }
  }, [orders, isError, error]);

  // Connection checker component
  const connectionChecker = (
    <OrderConnectionChecker 
      isConnected={isConnected}
      connectionAttempts={connectionAttempts}
      setConnectionAttempts={setConnectionAttempts}
      refetch={refetch}
    />
  );

  const handleRefreshOrders = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Refreshing orders",
        description: "Checking for new orders..."
      });
    } catch (error) {
      console.error('Error refreshing orders:', error);
      toast({
        title: "Error Refreshing",
        description: "Failed to refresh orders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleReconnect = async () => {
    toast({
      title: "Reconnecting...",
      description: "Attempting to reconnect to realtime updates"
    });
    
    // Force a refresh of the component
    refetch();
    setConnectionAttempts(0);
    
    try {
      // Test connection with a simple query
      const { error } = await supabase
        .from('orders')
        .select('count(*)', { count: 'exact', head: true });
        
      if (error) {
        throw error;
      }
      
      // Successful connection
      toast({
        title: "Connected",
        description: "Successfully reconnected to the database"
      });
    } catch (err) {
      console.error('Reconnection failed:', err);
      toast({
        title: "Reconnection Failed",
        description: "Could not reconnect. Will retry automatically.",
        variant: "destructive"
      });
    }
  };

  const filteredOrders = React.useMemo(() => {
    if (!orders || !orders.length) return [];
    
    if (statusFilter === 'all') {
      return orders;
    }
    
    return orders.filter(order => order.status === statusFilter);
  }, [orders, statusFilter]);

  if (isLoading) {
    return <OrderLoading />;
  }

  if (isError) {
    return <OrderErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageBreadcrumb pageName="Order List" />
      {connectionChecker}
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <OrderHeader
            statusFilter={statusFilter}
            onFilterChange={setStatusFilter}
            isConnected={isConnected}
            handleReconnect={handleReconnect}
            isRefreshing={isRefreshing}
            onRefresh={handleRefreshOrders}
            lastUpdate={lastUpdate}
          />
        </CardHeader>
        <CardContent>
          <OrderContent 
            filteredOrders={filteredOrders}
            onRefresh={handleRefreshOrders} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderList;
