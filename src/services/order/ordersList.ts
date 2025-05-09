
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
    // First check the connection to Supabase and authentication status
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Authentication error in fetchOrders:', authError);
      throw new Error(`Authentication error: ${authError.message}`);
    }
    
    if (!authData || !authData.user) {
      console.error('No authenticated user found');
      throw new Error('Authentication required: Please log in to access orders');
    }
    
    // Then check the connection to the database
    const connectionCheck = await supabase.from('orders').select('id', { count: 'exact', head: true });
    
    if (connectionCheck.error) {
      console.error('Connection error in fetchOrders:', connectionCheck.error);
      throw new Error(`Database connection error: ${connectionCheck.error.message}`);
    }
    
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
    // Re-throw the error with a more specific message depending on the type of error
    if (error instanceof Error) {
      if (error.message.includes('Authentication')) {
        throw new Error(`Authentication error: ${error.message}`);
      } else if (error.message.includes('connection')) {
        throw new Error(`Connection error: ${error.message}`);
      } else {
        throw error; // Re-throw the original error
      }
    } else {
      throw new Error('Unknown error occurred while fetching orders');
    }
  }
};
