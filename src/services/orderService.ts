
import { supabase } from '@/integrations/supabase/client';

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

  // Map order items to add special_instructions from customizations if needed
  const mappedOrderItems = orderItems.map(item => {
    // Extract special instructions from customizations if it exists
    let special_instructions = null;
    if (item.customizations && typeof item.customizations === 'object') {
      // Safely access special_instructions with proper type checking
      const customizations = item.customizations as Record<string, any>;
      special_instructions = customizations.special_instructions || null;
    }
    
    // Handle foods properly, ensuring it matches our interface
    let formattedFoods = null;
    
    // Check if foods exists and is not an error object
    if (item.foods && 
        typeof item.foods === 'object' && 
        item.foods !== null && 
        !('error' in (item.foods || {}))) {
      // Create a properly typed foods object
      formattedFoods = {
        id: item.foods.id || '',
        name: item.foods.name || 'Unknown item',
        image_url: item.foods.image_url || null
      };
    } else {
      // Provide default foods object if missing or has error
      formattedFoods = {
        id: '',
        name: 'Unknown item',
        image_url: null
      };
    }
    
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
      // No need to map total to total_amount anymore as we've updated our components
    }, 
    customer, 
    customerDetails, 
    orderItems: mappedOrderItems 
  };
};
