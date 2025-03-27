
import { supabase } from '@/integrations/supabase/client';

// Define an interface for the foods object to help with type safety
interface FoodItem {
  id: string;
  name: string;
  image_url: string | null;
}

export const fetchOrderDetail = async (orderId: string) => {
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
  const mappedOrderItems = orderItems.map(item => {
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
      item.foods && 
      typeof item.foods === 'object' && 
      item.foods !== null && 
      !('code' in item.foods) // Check if it's not an error object
        ? {
            id: (item.foods as any).id ?? defaultFoodItem.id,
            name: (item.foods as any).name ?? defaultFoodItem.name,
            image_url: (item.foods as any).image_url ?? defaultFoodItem.image_url
          }
        : defaultFoodItem;
    
    return {
      ...item,
      foods: formattedFoods,
      special_instructions,
      unit_price: item.unit_price
    };
  });

  return { 
    order: {
      ...order,
    }, 
    customer, 
    customerDetails, 
    orderItems: mappedOrderItems 
  };
};
