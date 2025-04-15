
import { supabase } from '@/integrations/supabase/client';
import { OrderDetail, Order } from './orderTypes';
import { fetchCustomerData, fetchCustomerDetails } from './customerQueries';
import { mapOrderItems } from './orderItemMapping';
import { validateOrderStatus } from './orderUtils';

/**
 * Fetches a detailed view of an order including customer data and order items
 */
export const fetchOrderDetail = async (orderId: string): Promise<OrderDetail> => {
  console.log('Fetching order details for ID:', orderId);
  
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

  // Fetch customer data and details
  const customer = await fetchCustomerData(order.customer_id);
  const customerDetails = customer ? await fetchCustomerDetails(customer.id) : null;

  // Fetch order items
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
    throw itemsError;
  }

  console.log('Fetched order items:', orderItems);

  const mappedOrderItems = mapOrderItems(orderItems);
  const validOrderStatus = validateOrderStatus(order.status);

  const formattedOrder: Order = {
    ...order,
    status: validOrderStatus,
    delivery_address: typeof order.delivery_address === 'string' 
      ? order.delivery_address 
      : order.delivery_address 
  };

  return { 
    order: formattedOrder, 
    customer, 
    customerDetails, 
    orderItems: mappedOrderItems 
  };
};

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

export { setupOrderNotifications } from './orderNotifications';
