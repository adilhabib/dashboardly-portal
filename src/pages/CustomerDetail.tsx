
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Mail, Phone, MapPin } from 'lucide-react';

// Define types for customer and order data
interface CustomerType {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  created_at: string;
  updated_at: string;
  user_id?: string | null;
}

interface OrderType {
  id: string;
  customer_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  payment_status?: string | null;
}

interface FetchResult {
  customer: CustomerType;
  orders: OrderType[];
}

const fetchCustomerDetail = async (customerId: string): Promise<FetchResult> => {
  // Fetch the customer without joining customer_details
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('*')
    .eq('id', customerId)
    .single();
  
  if (customerError) {
    console.error('Error fetching customer details:', customerError);
    throw customerError;
  }

  // Fetch orders for this customer
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (ordersError) {
    console.error('Error fetching customer orders:', ordersError);
    throw ordersError;
  }
  
  return { customer, orders: orders || [] };
};

const CustomerDetail = () => {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get('id');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => fetchCustomerDetail(customerId || ''),
    enabled: !!customerId,
  });

  if (isLoading) {
    return <div className="text-center py-10">Loading customer details...</div>;
  }

  if (isError || !data || !data.customer) {
    return <div className="text-center py-10 text-red-500">Error loading customer details</div>;
  }

  const { customer, orders } = data;

  return (
    <div className="container mx-auto px-4 py-6">
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
          <Card className="shadow-sm mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold">{customer.name}</CardTitle>
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit size={16} />
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                    {customer.email && (
                      <div className="flex items-center gap-2 mt-2">
                        <Mail size={16} className="text-gray-400" />
                        <span>{customer.email}</span>
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-center gap-2 mt-2">
                        <Phone size={16} className="text-gray-400" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  {customer.address && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Address</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span>{customer.address}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order: OrderType) => (
                    <div key={order.id} className="flex justify-between items-center border-b pb-4">
                      <div>
                        <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total_amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{order.status}</p>
                      </div>
                      <Link to={`/order-detail?id=${order.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No order history available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="shadow-sm mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Customer Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                  <p className="text-2xl font-bold mt-1">{orders?.length || 0}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
                  <p className="text-2xl font-bold mt-1">
                    ${orders?.reduce((sum: number, order: OrderType) => sum + Number(order.total_amount), 0).toFixed(2) || '0.00'}
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                  <p className="font-medium mt-1">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
