
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
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import OrderStatusFilter, { OrderStatusFilter as StatusFilterType } from '@/components/order/OrderStatusFilter';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';
import { setupOrderNotifications } from '@/services/order/orderNotifications';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const OrderList = () => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const { user } = useAuth();
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
      setConnectionError(error instanceof Error ? error.message : 'Unknown error fetching orders');
    }
  }, [orders, isError, error]);

  useEffect(() => {
    // Initial data load
    refetch();

    // Connection status check
    const checkSupabaseConnection = async () => {
      if (!user) {
        console.log('User not authenticated, skipping connection check');
        return;
      }
      
      try {
        console.log('Checking Supabase connection...');
        const { data, error } = await supabase.from('orders').select('count(*)', { count: 'exact', head: true });
        
        if (error) {
          console.error('Supabase connection check error:', error);
          setConnectionError(`Database connection error: ${error.message}`);
          toast({
            title: "Connection Error",
            description: "Unable to connect to the database. Please refresh the page or check your network.",
            variant: "destructive"
          });
        } else {
          console.log('Supabase connection successful');
          setConnectionError(null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown connection error';
        console.error('Failed to check Supabase connection:', err);
        setConnectionError(`Failed to connect to Supabase: ${errorMessage}`);
      }
    };

    checkSupabaseConnection();
    
    // Set up periodic connection checks
    const connectionCheckInterval = setInterval(() => {
      if (!isConnected) {
        console.log('Periodic connection check: Realtime is disconnected');
        checkSupabaseConnection();
      }
    }, 30000); // Check every 30 seconds if disconnected

    return () => {
      clearInterval(connectionCheckInterval);
    };
  }, [refetch, isConnected, user]);

  const handleRefreshOrders = async () => {
    setIsRefreshing(true);
    setConnectionError(null);
    try {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Refreshing orders",
        description: "Checking for new orders..."
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error refreshing orders:', error);
      setConnectionError(`Error refreshing orders: ${errorMessage}`);
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
    setConnectionError(null);
    toast({
      title: "Reconnecting...",
      description: "Attempting to reconnect to database"
    });
    
    // Force a refresh of the component
    await refetch();
    
    // Check the connection explicitly
    try {
      const { error } = await supabase.from('orders').select('count(*)', { count: 'exact', head: true });
      if (error) {
        setConnectionError(`Database connection error: ${error.message}`);
        throw error;
      }
      toast({
        title: "Connection Restored",
        description: "Successfully reconnected to the database",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Reconnection failed:', err);
      toast({
        title: "Reconnection Failed",
        description: `Could not reconnect: ${errorMessage}`,
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
    return <div className="text-center py-10">Loading orders...</div>;
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
                    <Badge 
                      variant="outline" 
                      className="bg-amber-50 text-amber-600 flex items-center gap-1 py-1 cursor-pointer hover:bg-amber-100"
                      onClick={handleReconnect}
                    >
                      <WifiOff size={14} className="text-amber-600" />
                      <span>Realtime Disconnected (click to reconnect)</span>
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
          
          {connectionError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md flex items-start gap-2 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Connection Error</p>
                <p>{connectionError}</p>
                <Button 
                  variant="link" 
                  onClick={handleReconnect} 
                  className="h-auto p-0 text-red-700 underline"
                >
                  Retry Connection
                </Button>
              </div>
            </div>
          )}
          
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
          {isError ? (
            <div className="text-center py-10 text-red-500">
              <p>Error loading orders</p>
              <p className="text-sm mt-2">{error instanceof Error ? error.message : 'Unknown error'}</p>
              <Button 
                onClick={() => refetch()} 
                className="mt-4"
                variant="outline"
              >
                Retry
              </Button>
            </div>
          ) : filteredOrders.length > 0 ? (
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
