import { supabase } from '@/integrations/supabase/client';
import { OrderDetail, OrderItem, FoodItem, Order, OrderStatus } from './orderTypes';
import { toast } from '@/hooks/use-toast';

/**
 * Fetches a detailed view of an order including customer data and order items
 */
export const fetchOrderDetail = async (orderId: string): Promise<OrderDetail> => {
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

  // Fetch order items - UPDATED QUERY TO AVOID USING RELATIONSHIP
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
    throw itemsError;
  }

  console.log('Fetched order items:', orderItems);

  // Map order items with proper null checking
  const mappedOrderItems: OrderItem[] = (orderItems || []).map(item => {
    // Extract special instructions from customizations if it exists
    let special_instructions = null;
    if (item.customizations && typeof item.customizations === 'object') {
      const customizations = item.customizations as Record<string, any>;
      special_instructions = customizations.special_instructions || null;
    }
    
    // Create a default food item since we can't join with foods table
    const productData = item.product_data as Record<string, any> || {};
    const defaultFoodItem: FoodItem = {
      id: item.product_id || '',
      name: productData.name || 'Unknown item',
      image_url: productData.image_url || null
    };
    
    return {
      ...item,
      foods: defaultFoodItem,
      special_instructions,
      unit_price: item.unit_price,
      customizations: item.customizations as Record<string, any> | null,
      product_data: item.product_data as Record<string, any> | null
    };
  });

  // Validate and convert the order status to ensure it's a valid OrderStatus
  const validOrderStatus = validateOrderStatus(order.status);

  // Safely convert delivery_address to ensure type compatibility
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
 * Validates and ensures the order status is of type OrderStatus
 */
function validateOrderStatus(status: string): OrderStatus {
  const validStatuses: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled'];
  
  if (validStatuses.includes(status as OrderStatus)) {
    return status as OrderStatus;
  }
  
  // Default to 'pending' if an invalid status is provided
  console.warn(`Invalid order status: ${status}. Defaulting to 'pending'`);
  return 'pending';
}

/**
 * Fetches all orders with customer data
 */
export const fetchOrders = async () => {
  console.log('Fetching orders...');
  
  try {
    // Check if the orders table exists and has data
    const { count, error: countError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error checking orders count:', countError);
      throw countError;
    }
    
    console.log('Orders count:', count);
    
    // Fetch orders with more detailed logging
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
    
    // If no orders were found, return an empty array
    if (!orders || orders.length === 0) {
      return [];
    }
    
    // For each order, fetch the customer data separately and validate order status
    const ordersWithCustomers = await Promise.all(
      orders.map(async (order) => {
        // Validate order status
        const validOrderStatus = validateOrderStatus(order.status);
        
        // Ensure delivery_address is properly formatted
        const formattedOrder = {
          ...order,
          status: validOrderStatus,
          delivery_address: typeof order.delivery_address === 'string' 
            ? order.delivery_address 
            : order.delivery_address as unknown as Record<string, any> | null
        };
        
        if (formattedOrder.customer_id) {
          const { data: customer, error: customerError } = await supabase
            .from('customer')
            .select('name, phone_number, email')
            .eq('id', formattedOrder.customer_id)
            .maybeSingle();
          
          if (customerError) {
            console.error('Error fetching customer for order:', customerError);
            return { ...formattedOrder, customer: null };
          }
          
          return { ...formattedOrder, customer };
        }
        
        return { ...formattedOrder, customer: null };
      })
    );
    
    console.log('Orders with customers:', ordersWithCustomers.length);
    if (ordersWithCustomers.length > 0) {
      console.log('Sample processed order:', ordersWithCustomers[0]);
    }
    
    return ordersWithCustomers;
  } catch (error) {
    console.error('Unexpected error in fetchOrders:', error);
    return [];
  }
};

// Set up real-time subscription for new orders
export const setupOrderNotifications = () => {
  const channel = supabase
    .channel('public:orders')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'orders' },
      (payload) => {
        const newOrder = payload.new as Order;
        const orderIdDisplay = newOrder.id ? String(newOrder.id).slice(0, 8) : 'Unknown';
        
        // Show toast notification for new order
        toast({
          title: "New Order Received",
          description: `Order #${orderIdDisplay} has been placed.`,
          duration: 5000,
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
