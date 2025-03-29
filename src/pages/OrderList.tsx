
import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { toast } from '@/hooks/use-toast';
import { fetchOrders } from '@/services/order';
import { fetchCustomers } from '@/services/customerService';
import { OrderTable, EmptyStateMessage, OrderActions } from '@/components/order';
import { getStatusColor, formatDate } from '@/services/orderUtils';
import { useOrderRealtime } from '@/hooks/useOrderRealtime';

const OrderList = () => {
  const queryClient = useQueryClient();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  
  // Use our custom hook for real-time updates
  useOrderRealtime();
  
  const { data: orders, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    // Increase the staleness time to prevent unnecessary refetching
    staleTime: 1000 * 60, // 1 minute
  });

  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  useEffect(() => {
    console.log('Orders data in component:', orders);
    if (isError) {
      console.error('Error in useQuery:', error);
    }
  }, [orders, isError, error]);

  // Force a refetch when the component mounts
  useEffect(() => {
    // Retry fetching on component mount
    refetch();
  }, [refetch]);

  const handleRefreshOrders = () => {
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    toast({
      title: "Refreshing orders",
      description: "Checking for new orders..."
    });
  };

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
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Order List</CardTitle>
          <div className="flex space-x-2">
            <button 
              onClick={handleRefreshOrders} 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Refresh
            </button>
            <OrderActions 
              customers={customers}
              isCreatingOrder={isCreatingOrder}
              setIsCreatingOrder={setIsCreatingOrder}
            />
          </div>
        </CardHeader>
        <CardContent>
          {orders && orders.length > 0 ? (
            <OrderTable 
              orders={orders} 
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
