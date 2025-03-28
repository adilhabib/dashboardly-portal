
import { supabase } from '@/integrations/supabase/client';
import { Order } from './orderTypes';

/**
 * Creates a test order for a customer
 * Uses the create_order RPC function to bypass RLS policies
 */
export const createTestOrder = async (customerId: string): Promise<Order> => {
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
    
    // First cast to unknown, then to Order to avoid direct casting issues
    const orderResponse = data as unknown as Order;
    
    console.log('Test order created:', orderResponse);
    return orderResponse;
  } catch (error) {
    console.error('Failed to create test order:', error);
    throw error;
  }
};
