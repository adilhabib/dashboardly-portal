
import { supabase } from '@/integrations/supabase/client';
import { Order } from './orderTypes';
import { fetchCustomerData } from './customerQueries';
import { validateOrderStatus } from './orderUtils';

/**
 * Fetches all orders with customer data
 */
export const fetchOrders = async () => {
  console.log('Fetching orders...');
  
  try {
    const { count, error: countError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error checking orders count:', countError);
      throw countError;
    }
    
    console.log('Orders count:', count);
    
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
    
    const ordersWithCustomers = await Promise.all(
      orders.map(async (order) => {
        const validOrderStatus = validateOrderStatus(order.status);
        
        const formattedOrder = {
          ...order,
          status: validOrderStatus,
          delivery_address: typeof order.delivery_address === 'string' 
            ? order.delivery_address 
            : order.delivery_address as unknown as Record<string, any> | null
        };
        
        const customer = formattedOrder.customer_id ? 
          await fetchCustomerData(formattedOrder.customer_id) : null;
        
        return { ...formattedOrder, customer };
      })
    );
    
    return ordersWithCustomers;
  } catch (error) {
    console.error('Unexpected error in fetchOrders:', error);
    return [];
  }
};
