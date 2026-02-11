
import { supabase } from '@/integrations/supabase/client';
import { Order } from './orderTypes';
import { validateOrderStatus } from './orderUtils';

/**
 * Fetches all orders with customer data (batch-loaded)
 */
export const fetchOrders = async () => {
  try {
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      throw ordersError;
    }
    
    if (!orders || orders.length === 0) {
      return [];
    }
    
    // Batch-fetch all unique customers in one query
    const uniqueCustomerIds = [...new Set(orders.map(o => o.customer_id).filter(Boolean))];
    
    let customerMap: Record<string, any> = {};
    if (uniqueCustomerIds.length > 0) {
      const { data: customers } = await supabase
        .from('customer')
        .select('*')
        .in('id', uniqueCustomerIds);
      
      if (customers) {
        customerMap = Object.fromEntries(customers.map(c => [c.id, c]));
      }
    }
    
    return orders.map(order => ({
      ...order,
      status: validateOrderStatus(order.status),
      delivery_address: order.delivery_address,
      customer: customerMap[order.customer_id] || null,
    }));
  } catch (error) {
    console.error('Unexpected error in fetchOrders:', error);
    return [];
  }
};
