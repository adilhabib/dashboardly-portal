
import { supabase } from '@/integrations/supabase/client';
import { OrderDetail, OrderItem, FoodItem, Order } from './orderTypes';

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

  // Map order items with proper null checking
  const mappedOrderItems: OrderItem[] = orderItems.map(item => {
    // Extract special instructions from customizations if it exists
    let special_instructions = null;
    if (item.customizations && typeof item.customizations === 'object') {
      const customizations = item.customizations as Record<string, any>;
      special_instructions = customizations.special_instructions || null;
    }
    
    // Default food item structure if foods is null or invalid
    const defaultFoodItem: FoodItem = {
      id: '',
      name: 'Unknown item',
      image_url: null
    };
    
    // Safely handle foods with proper null checking
    const formattedFoods: FoodItem = 
      (item.foods !== null && 
      item.foods !== undefined && 
      typeof item.foods === 'object' && 
      // Make sure it's not an error object from Supabase
      !('code' in (item.foods as object)))
        ? {
            id: ((item.foods as any).id ?? defaultFoodItem.id),
            name: ((item.foods as any).name ?? defaultFoodItem.name),
            image_url: ((item.foods as any).image_url ?? defaultFoodItem.image_url)
          }
        : defaultFoodItem;
    
    return {
      ...item,
      foods: formattedFoods,
      special_instructions,
      unit_price: item.unit_price,
      customizations: item.customizations as Record<string, any> | null,
      product_data: item.product_data as Record<string, any> | null
    };
  });

  // Safely convert delivery_address to ensure type compatibility
  const formattedOrder: Order = {
    ...order,
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
  
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (ordersError) {
    console.error('Error fetching orders:', ordersError);
    throw ordersError;
  }
  
  console.log('Orders fetched:', orders ? orders.length : 0, 'records found');
  
  // If no orders were found, return an empty array
  if (!orders || orders.length === 0) {
    return [];
  }
  
  // For each order, fetch the customer data separately
  const ordersWithCustomers = await Promise.all(
    orders.map(async (order) => {
      // Ensure delivery_address is properly formatted
      const formattedOrder = {
        ...order,
        delivery_address: typeof order.delivery_address === 'string' 
          ? order.delivery_address 
          : order.delivery_address as unknown as Record<string, any> | null
      };
      
      if (formattedOrder.customer_id) {
        const { data: customer, error: customerError } = await supabase
          .from('customer')
          .select('name, phone_number')
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
  return ordersWithCustomers;
};
