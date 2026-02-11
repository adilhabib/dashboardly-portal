
import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { toast } from '@/hooks/use-toast';
import { fetchOrders } from '@/services/order';
import { OrderTable, EmptyStateMessage } from '@/components/order';
import { getStatusColor, formatDate } from '@/services/orderUtils';
import { useOrderRealtime } from '@/hooks/useOrderRealtime';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import OrderStatusFilter, { OrderStatusFilter as StatusFilterType } from '@/components/order/OrderStatusFilter';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';
import { setupOrderNotifications } from '@/services/order/orderNotifications';
import { supabase } from '@/integrations/supabase/client';

const OrderList = () => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');
  
  const { addNotification } = useNotifications();
  const { isConnected, lastUpdate } = useOrderRealtime();
  
  useEffect(() => {
    const cleanup = setupOrderNotifications(addNotification);
    return () => cleanup();
  }, [addNotification]);

  const { data: orders, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    staleTime: 1000 * 60,
    retry: 3,
  });

  useEffect(() => {
    console.log('Orders data in component:', orders);
    if (isError) {
      console.error('Error in useQuery:', error);
    }
  }, [orders, isError, error]);

  useEffect(() => {
    refetch();
  }, [refetch]);

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

  // Connection recovery handler
  const handleReconnect = async () => {
    toast({
      title: "Reconnecting...",
      description: "Attempting to reconnect to realtime updates"
    });
    
    // Force a refresh of the component
    refetch();
    
    // We'll let the useOrderRealtime hook handle the actual reconnection
  };

  const filteredOrders = React.useMemo(() => {
    if (!orders || !orders.length) return [];
    
    if (statusFilter === 'all') {
      return orders;
    }
    
    return orders.filter(order => order.status === statusFilter);
  }, [orders, statusFilter]);

  if (isLoading) {
    return <div className="text-center py-10">Loading orders...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>Error loading orders</p>
        <p className="text-sm mt-2">{error instanceof Error ? error.message : 'Unknown error'}</p>
        <button 
          onClick={() => refetch()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
      <PageBreadcrumb pageName="Order List" />
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2 px-3 md:px-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl md:text-2xl font-bold">Order List</CardTitle>
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <Badge variant="outline" className="bg-green-50 text-green-600 flex items-center gap-1 py-1 text-xs">
                    <Wifi size={12} className="text-green-600" />
                    <span className="hidden sm:inline">Connected</span>
                  </Badge>
                ) : (
                  <Badge 
                    variant="outline" 
                    className="bg-amber-50 text-amber-600 flex items-center gap-1 py-1 cursor-pointer hover:bg-amber-100 text-xs"
                    onClick={handleReconnect}
                  >
                    <WifiOff size={12} className="text-amber-600" />
                    <span className="hidden sm:inline">Reconnect</span>
                  </Badge>
                )}
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshOrders} 
                  disabled={isRefreshing}
                  className="flex items-center gap-1"
                >
                  <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              </div>
            </div>
            
            <OrderStatusFilter 
              value={statusFilter} 
              onChange={setStatusFilter} 
            />
          </div>
          
          {lastUpdate.timestamp && (
            <div className="text-xs text-gray-500 mt-2">
              Last update: {lastUpdate.type} - {lastUpdate.timestamp.toLocaleTimeString()}
              {lastUpdate.order && lastUpdate.order.id && 
                <span> - Order #{(lastUpdate.order.id as string).slice(0, 8)}</span>
              }
            </div>
          )}
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          {filteredOrders.length > 0 ? (
            <OrderTable 
              orders={filteredOrders} 
              getStatusColor={getStatusColor} 
              formatDate={formatDate} 
            />
          ) : (
            <EmptyStateMessage onRefresh={handleRefreshOrders} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderList;
