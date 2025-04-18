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

    const checkSupabase = async () => {
      try {
        const { data, error } = await supabase.from('orders').select('count(*)', { count: 'exact', head: true });
        if (error) {
          console.error('Supabase connection check error:', error);
        } else {
          console.log('Supabase connection successful, count result:', data);
        }
      } catch (err) {
        console.error('Failed to check Supabase connection:', err);
      }
    };

    checkSupabase();
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
    <div className="container mx-auto px-4 py-6">
      <PageBreadcrumb pageName="Order List" />
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-2xl font-bold">Order List</CardTitle>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <OrderStatusFilter 
                value={statusFilter} 
                onChange={setStatusFilter} 
              />
              
              <div className="flex items-center gap-2 ml-auto">
                <div className="flex items-center text-sm text-gray-500 mr-2">
                  {isConnected ? (
                    <Badge variant="outline" className="bg-green-50 text-green-600 flex items-center gap-1 py-1">
                      <Wifi size={14} className="text-green-600" />
                      <span>Realtime Connected</span>
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 text-amber-600 flex items-center gap-1 py-1">
                      <WifiOff size={14} className="text-amber-600" />
                      <span>Realtime Disconnected</span>
                    </Badge>
                  )}
                </div>
                <Button 
                  variant="outline"
                  onClick={handleRefreshOrders} 
                  disabled={isRefreshing}
                  className="flex items-center gap-2"
                >
                  <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                  Refresh
                </Button>
              </div>
            </div>
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
        <CardContent>
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
