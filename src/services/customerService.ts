import { supabase } from '@/integrations/supabase/client';

export const fetchCustomerDetail = async (customerId: string) => {
  console.log('Fetching customer details for ID:', customerId);
  
  // Fetch customer data
  const { data: customer, error: customerError } = await supabase
    .from('customer')
    .select('*')
    .eq('id', customerId)
    .single();
  
  if (customerError) {
    console.error('Error fetching customer details:', customerError);
    throw customerError;
  }

  console.log('Fetched customer:', customer);

  // Fetch customer details if available
  const { data: customerDetails, error: detailsError } = await supabase
    .from('customer_details')
    .select('*')
    .eq('customer_id', customerId)
    .maybeSingle();
  
  if (detailsError) {
    console.error('Error fetching customer details:', detailsError);
    // Don't throw here, just continue without the details
  }

  console.log('Fetched customer details:', customerDetails);

  // Fetch orders for this customer
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (ordersError) {
    console.error('Error fetching customer orders:', ordersError);
    // Don't throw here, just continue without orders
  }
  
  console.log('Fetched orders for customer:', orders ? orders.length : 0);
  if (orders && orders.length > 0) {
    console.log('Sample order data:', orders[0]);
  }
  
  return { customer, customerDetails, orders: orders || [] };
};

export const fetchCustomers = async () => {
  console.log('Fetching customers from the customer table');
  const { data, error } = await supabase
    .from('customer')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
  
  console.log('Fetched customers:', data);
  return data;
};

export const fetchCustomerOrders = async (customerId: string) => {
  console.log('Fetching orders for customer ID:', customerId);
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', customerId);
  
  if (error) {
    console.error('Error fetching customer orders:', error);
    throw error;
  }
  
  console.log('Fetched orders count:', data?.length || 0);
  return data || [];
};

export const fetchCustomerDefaultAddress = async (customerId: string) => {
  console.log('Fetching default address for customer:', customerId);
  
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', customerId)
    .eq('is_default', 1)
    .single();
  
  if (error) {
    console.error('Error fetching customer default address:', error);
    return null;
  }
  
  console.log('Fetched default address:', data);
  return data;
};
