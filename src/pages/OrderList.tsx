import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { toast } from '@/hooks/use-toast';
import { fetchCustomers } from '@/services/customerService';

const fetchOrders = async () => {
  console.log('Fetching orders...');
  
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (ordersError) {
    console.error('Error fetching orders:', ordersError);
    throw ordersError;
  }
  
  console.log('Orders fetched:', orders ? orders.length : 0, 'records found');
  console.log('Sample order data:', orders && orders.length > 0 ? orders[0] : 'No orders found');
  
  const ordersWithCustomers = await Promise.all(
    orders.map(async (order) => {
      if (order.customer_id) {
        const { data: customer, error: customerError } = await supabase
          .from('customer')
          .select('name, phone_number')
          .eq('id', order.customer_id)
          .maybeSingle();
        
        if (customerError) {
          console.error('Error fetching customer for order:', customerError);
          return { ...order, customer: null };
        }
        
        return { ...order, customer };
      }
      
      return { ...order, customer: null };
    })
  );
  
  console.log('Orders with customers:', ordersWithCustomers.length);
  return ordersWithCustomers;
};

const createTestOrder = async (customerId) => {
  console.log('Creating test order for customer ID:', customerId);
  
  const { data: newOrder, error } = await supabase
    .from('orders')
    .insert({
      customer_id: customerId,
      status: 'pending',
      payment_status: 'unpaid',
      payment_method: 'cash',
      order_type: 'delivery',
      subtotal: 1500.00,
      tax: 7.5,
      total: 1612.50,
      special_instructions: 'Test order, please do not process.'
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating test order:', error);
    throw error;
  }
  
  console.log('Test order created:', newOrder);
  return newOrder;
};

const OrderList = () => {
  const queryClient = useQueryClient();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  
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

  useEffect(() => {
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        (payload) => {
          console.log('Real-time update received:', payload);
          
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
          
          queryClient.invalidateQueries({ queryKey: ['orders'] });
        })
      .subscribe();

    console.log('Subscribed to real-time updates for orders table');

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleCreateTestOrder = async () => {
    if (!customers || customers.length === 0) {
      toast({
        title: "No customers found",
        description: "Please create a customer first before creating a test order.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCreatingOrder(true);
      const customer = customers[0];
      const newOrder = await createTestOrder(customer.id);
      
      toast({
        title: "Test Order Created",
        description: `New test order #${newOrder.id.slice(0, 8)} has been created for ${customer.name}.`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (error) {
      console.error('Error creating test order:', error);
      toast({
        title: "Error Creating Order",
        description: "Failed to create test order. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

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
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Order List</CardTitle>
          <Button 
            onClick={handleCreateTestOrder} 
            disabled={isCreatingOrder}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Create Test Order
          </Button>
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
                You don't have any orders in your database yet. Click the "Create Test Order" button above to add a test order.
              </p>
              <div className="mt-4">
                <Button
                  variant="outline" 
                  onClick={() => {
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
