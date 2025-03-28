
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
  
  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
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
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageBreadcrumb pageName="Order List" />
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Order List</CardTitle>
          <OrderActions 
            customers={customers}
            isCreatingOrder={isCreatingOrder}
            setIsCreatingOrder={setIsCreatingOrder}
          />
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
