
import { supabase } from '@/integrations/supabase/client';

/**
 * Updates an order's status
 */
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    console.log(`Updating order ${orderId} status to ${status}`);
    
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw error;
  }
};

/**
 * Updates an order's payment status
 */
export const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
  try {
    console.log(`Updating order ${orderId} payment status to ${paymentStatus}`);
    
    const { data, error } = await supabase
      .from('orders')
      .update({ payment_status: paymentStatus })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to update payment status:', error);
    throw error;
  }
};
