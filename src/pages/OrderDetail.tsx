
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import OrderSummaryCard from '@/components/order-detail/OrderSummaryCard';
import CustomerInfoCard from '@/components/order-detail/CustomerInfoCard';
import { fetchOrderDetail } from '@/services/orderService';

const OrderDetail = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrderDetail(orderId || ''),
    enabled: !!orderId,
  });

  if (isLoading) {
    return <div className="text-center py-10">Loading order details...</div>;
  }

  if (isError || !data || !data.order) {
    return <div className="text-center py-10 text-red-500">Error loading order details</div>;
  }

  const { order, customer, customerDetails, orderItems } = data;

  // Convert delivery_address to string if it's a JSON object
  const deliveryAddressString = order.delivery_address ? 
    (typeof order.delivery_address === 'string' ? 
      order.delivery_address : 
      JSON.stringify(order.delivery_address)) : 
    undefined;

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
          <OrderSummaryCard 
            order={order} 
            orderItems={orderItems} 
          />
        </div>
        
        <div>
          <CustomerInfoCard 
            customer={customer} 
            customerDetails={customerDetails} 
            deliveryAddress={deliveryAddressString} 
          />
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
