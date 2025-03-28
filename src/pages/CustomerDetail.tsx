
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { ProfileCard, OrderHistoryCard, SummaryCard } from '@/components/customer-detail';
import { fetchCustomerDetail } from '@/services/customerService';

const CustomerDetail = () => {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get('id');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => fetchCustomerDetail(customerId || ''),
    enabled: !!customerId,
  });

  // Log data for debugging
  useEffect(() => {
    console.log('Customer detail data:', data);
    if (data?.orders) {
      console.log('Orders for customer:', data.orders.length);
    }
  }, [data]);

  if (isLoading) {
    return <div className="text-center py-10">Loading customer details...</div>;
  }

  if (isError || !data || !data.customer) {
    return <div className="text-center py-10 text-red-500">Error loading customer details</div>;
  }

  const { customer, customerDetails, orders } = data;

  return (
    <div className="container mx-auto px-4 py-6">
      <PageBreadcrumb pageName="Customer Details" />
      
      <div className="mb-6">
        <Link to="/customer">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Customers
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ProfileCard customer={customer} customerDetails={customerDetails} />
          <OrderHistoryCard orders={orders} />
        </div>
        
        <div>
          <SummaryCard customer={customer} orders={orders} />
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
