
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
import { RefreshCw, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import OrderStatusFilter, { OrderStatusFilter as StatusFilterType } from '@/components/order/OrderStatusFilter';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';
import { setupOrderNotifications } from '@/services/order/orderNotifications';
import { checkSupabaseConnection } from '@/integrations/supabase/client';

const OrderList = () => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  
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
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    console.log('Orders data in component:', orders);
    if (isError) {
      console.error('Error in useQuery:', error);
    }
  }, [orders, isError, error]);

  useEffect(() => {
    // Connection status check
    const checkConnection = async () => {
      setConnectionStatus('checking');
      try {
        console.log('Checking Supabase connection...');
        const isConnected = await checkSupabaseConnection();
        
        if (isConnected) {
          console.log('Supabase connection successful');
          setConnectionStatus('connected');
        } else {
          console.error('Supabase connection failed');
          setConnectionStatus('disconnected');
          toast({
            title: "Connection Error",
            description: "Unable to connect to the database. Please check your internet connection.",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error('Failed to check Supabase connection:', err);
        setConnectionStatus('disconnected');
        toast({
          title: "Connection Error", 
          description: "Database connection check failed. Please try refreshing the page.",
          variant: "destructive"
        });
      }
    };

    checkConnection();
    
    // Set up periodic connection checks only if disconnected
    const connectionCheckInterval = setInterval(() => {
      if (connectionStatus === 'disconnected' || !isConnected) {
        console.log('Periodic connection check: Checking connection status');
        checkConnection();
      }
    }, 30000); // Check every 30 seconds if disconnected

    return () => {
      clearInterval(connectionCheckInterval);
    };
  }, [connectionStatus, isConnected]);

  const handleRefreshOrders = async () => {
    setIsRefreshing(true);
    try {
      // First check connection
      const connectionOk = await checkSupabaseConnection();
      if (!connectionOk) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to database. Please check your connection.",
          variant: "destructive"
        });
        return;
      }
      
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
      description: "Attempting to reconnect to the database"
    });
    
    setConnectionStatus('checking');
    const connectionOk = await checkSupabaseConnection();
    
    if (connectionOk) {
      setConnectionStatus('connected');
      // Force a refresh of the component
      refetch();
    } else {
      setConnectionStatus('disconnected');
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
        <AlertTriangle className="mx-auto mb-4" size={48} />
        <p className="text-lg font-semibold">Error loading orders</p>
        <p className="text-sm mt-2">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
        <div className="flex gap-4 justify-center mt-4">
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
          <button 
            onClick={handleReconnect}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Check Connection
          </button>
        </div>
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
                  {connectionStatus === 'connected' && isConnected ? (
                    <Badge variant="outline" className="bg-green-50 text-green-600 flex items-center gap-1 py-1">
                      <Wifi size={14} className="text-green-600" />
                      <span>Connected</span>
                    </Badge>
                  ) : connectionStatus === 'checking' ? (
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 flex items-center gap-1 py-1">
                      <RefreshCw size={14} className="text-blue-600 animate-spin" />
                      <span>Checking...</span>
                    </Badge>
                  ) : (
                    <Badge 
                      variant="outline" 
                      className="bg-red-50 text-red-600 flex items-center gap-1 py-1 cursor-pointer hover:bg-red-100"
                      onClick={handleReconnect}
                    >
                      <WifiOff size={14} className="text-red-600" />
                      <span>Disconnected (click to reconnect)</span>
                    </Badge>
                  )}
                </div>
                <Button 
                  variant="outline"
                  onClick={handleRefreshOrders} 
                  disabled={isRefreshing || connectionStatus === 'checking'}
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
