
import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { toast } from '@/hooks/use-toast';

const fetchOrders = async () => {
  try {
    console.log('Fetching orders...');
    
    // Use a join query to fetch orders with customer data
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        customer:customer_id(name, phone_number)
      `)
      .order('created_at', { ascending: false });
    
    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      throw new Error(`Failed to fetch orders: ${ordersError.message}`);
    }
    
    if (!orders) {
      console.error('No orders data received from the database');
      throw new Error('No orders data received from the database');
    }
    
    console.log('Orders fetched:', orders.length, 'records found');
    console.log('Sample order data:', orders.length > 0 ? orders[0] : 'No orders found');
    
    // Transform the response to match the expected format
    const ordersWithCustomers = orders.map(order => ({
      ...order,
      customer: order.customer || null
    }));
    
    console.log('Orders with customers:', ordersWithCustomers.length);
    return ordersWithCustomers;
  } catch (error) {
    console.error('Error in fetchOrders:', error);
    throw error instanceof Error ? error : new Error('An unexpected error occurred while fetching orders');
  }

};

const OrderList = () => {
  const queryClient = useQueryClient();
  
  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  // Log actual data and any errors
  useEffect(() => {
    console.log('Orders data in component:', orders);
    if (isError) {
      console.error('Error in useQuery:', error);
    }
  }, [orders, isError, error]);

  // Subscribe to real-time changes in the orders table
  useEffect(() => {
    // Enable real-time for the orders table
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        (payload) => {
          console.log('Real-time update received:', payload);
          
          // Show toast notification based on the event type
          if (payload.eventType === 'INSERT') {
            toast({
              title: 'New Order Received',
              description: `Order #${payload.new.id.slice(0, 8)} has been placed.`,
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: 'Order Updated',
              description: `Order #${payload.new.id.slice(0, 8)} has been updated to "${payload.new.status}".`,
            });
          } else if (payload.eventType === 'DELETE') {
            toast({
              title: 'Order Deleted',
              description: `Order #${payload.old.id.slice(0, 8)} has been removed.`,
            });
          }
          
          // Invalidate and refetch orders
          queryClient.invalidateQueries({ queryKey: ['orders'] });
        })
      .subscribe();

    console.log('Subscribed to real-time updates for orders table');

    // Cleanup subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
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
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">Order List</CardTitle>
        </CardHeader>
        <CardContent>
          {orders && orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      {order.customer?.name || 'Unknown'}
                      <div className="text-xs text-gray-500">{order.customer?.phone_number || 'No phone'}</div>
                    </TableCell>
                    <TableCell>{formatDate(order.created_at)}</TableCell>
                    <TableCell>PKR {order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.payment_status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Link to={`/order-detail?id=${order.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye size={16} />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No orders available</p>
              <p className="text-sm text-gray-400 mt-2">
                You don't have any orders in your database yet. Try adding some orders to see them here.
              </p>
              <div className="mt-4">
                <Button
                  variant="outline" 
                  onClick={() => {
                    // Manually trigger a refetch
                    queryClient.invalidateQueries({ queryKey: ['orders'] });
                    toast({
                      title: "Refreshing orders",
                      description: "Checking for new orders..."
                    });
                  }}
                >
                  Refresh Orders
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderList;
