
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates a test order for a customer
 * Uses the create_order RPC function to bypass RLS policies
 */
export const createTestOrder = async (customerId: string) => {
  try {
    console.log('Creating test order for customer:', customerId);
    
    // Prepare order data
    const orderData = {
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
    };
    
    // Call the RPC function that bypasses RLS policies
    const { data, error } = await supabase
      .rpc('create_order', { order_data: orderData });
    
    if (error) {
      console.error('Error creating test order:', error);
      throw error;
    }
    
    console.log('Test order created:', data);
    return data;
  } catch (error) {
    console.error('Failed to create test order:', error);
    throw error;
  }
};
