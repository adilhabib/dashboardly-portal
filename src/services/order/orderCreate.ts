
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates a test order for a customer
 */
export const createTestOrder = async (customerId: string) => {
  try {
    console.log('Creating test order for customer:', customerId);
    
    // Create a new order
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        order_type: 'delivery',
        status: 'pending',
        payment_status: 'paid',
        payment_method: 'card',
        subtotal: 1500,
        tax: 150,
        delivery_fee: 100,
        total: 1750,
        special_instructions: 'Test order created from the order management screen'
      })
      .select()
      .single();
    
    if (orderError) {
      console.error('Error creating test order:', orderError);
      throw orderError;
    }
    
    console.log('Test order created:', newOrder);
    return newOrder;
  } catch (error) {
    console.error('Failed to create test order:', error);
    throw error;
  }
};
