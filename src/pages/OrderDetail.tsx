
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import PageBreadcrumb from '@/components/PageBreadcrumb';

const fetchOrderDetail = async (orderId: string) => {
  console.log('Fetching order details for ID:', orderId);
  
  // Fetch order data
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();
  
  if (orderError) {
    console.error('Error fetching order details:', orderError);
    throw orderError;
  }

  console.log('Fetched order:', order);

  // Fetch customer data separately
  let customer = null;
  if (order.customer_id) {
    const { data: customerData, error: customerError } = await supabase
      .from('customer')
      .select('*')
      .eq('id', order.customer_id)
      .single();
    
    if (customerError) {
      console.error('Error fetching customer details:', customerError);
      // Don't throw, we'll continue without customer data
    } else {
      customer = customerData;
      console.log('Fetched customer:', customer);
    }
  }

  // Fetch customer details if we have a customer
  let customerDetails = null;
  if (customer) {
    const { data: detailsData, error: detailsError } = await supabase
      .from('customer_details')
      .select('*')
      .eq('customer_id', customer.id)
      .maybeSingle();
    
    if (detailsError) {
      console.error('Error fetching customer details:', detailsError);
    } else if (detailsData) {
      customerDetails = detailsData;
      console.log('Fetched customer details:', customerDetails);
    }
  }

  // Fetch order items
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select(`
      *,
      foods(*)
    `)
    .eq('order_id', orderId);

  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
    throw itemsError;
  }

  console.log('Fetched order items:', orderItems);

  return { order, customer, customerDetails, orderItems };
};

const OrderDetail = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrderDetail(orderId || ''),
    enabled: !!orderId,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading order details...</div>;
  }

  if (isError || !data || !data.order) {
    return <div className="text-center py-10 text-red-500">Error loading order details</div>;
  }

  const { order, customer, customerDetails, orderItems } = data;

  return (
    <div className="container mx-auto px-4 py-6">
      <PageBreadcrumb pageName="Order Details" />
      
      <div className="mb-6">
        <Link to="/order-list">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Orders
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-sm mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold">Order #{order.id.slice(0, 8)}</CardTitle>
                  <CardDescription>Placed on {formatDate(order.created_at)}</CardDescription>
                </div>
                <Badge className={
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Order Items</h3>
                  <div className="space-y-4">
                    {orderItems && orderItems.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center border-b pb-4">
                        <div className="flex items-center gap-4">
                          {item.foods.image_url && (
                            <img 
                              src={item.foods.image_url} 
                              alt={item.foods.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          )}
                          <div>
                            <p className="font-medium">{item.foods.name}</p>
                            <p className="text-sm text-gray-500">
                              {item.quantity} × PKR {item.price_per_item.toFixed(2)}
                            </p>
                            {item.special_instructions && (
                              <p className="text-sm italic mt-1">"{item.special_instructions}"</p>
                            )}
                          </div>
                        </div>
                        <p className="font-medium">PKR {item.total_price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <Badge variant="outline">{order.payment_status}</Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-xl font-bold">PKR {order.total_amount.toFixed(2)}</p>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card className="shadow-sm mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Name</h4>
                <p>{customer?.name || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Contact</h4>
                <p>{customer?.phone_number || 'No phone'}</p>
                <p className="text-sm">{customer?.email || 'No email'}</p>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-gray-500">Delivery Address</h4>
                <p>{order.delivery_address || customer?.address || 'No address provided'}</p>
              </div>
              {customerDetails?.dietary_restrictions && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Dietary Restrictions</h4>
                    <p>{customerDetails.dietary_restrictions}</p>
                  </div>
                </>
              )}
              {customerDetails?.delivery_instructions && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Delivery Instructions</h4>
                    <p>{customerDetails.delivery_instructions}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
