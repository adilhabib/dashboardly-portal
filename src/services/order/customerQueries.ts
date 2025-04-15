
import { supabase } from '@/integrations/supabase/client';

export const fetchCustomerData = async (customerId: string) => {
  if (!customerId) return null;
  
  const { data: customer, error: customerError } = await supabase
    .from('customer')
    .select('*')
    .eq('id', customerId)
    .single();
  
  if (customerError) {
    console.error('Error fetching customer details:', customerError);
    return null;
  }
  
  return customer;
};

export const fetchCustomerDetails = async (customerId: string) => {
  if (!customerId) return null;
  
  const { data: detailsData, error: detailsError } = await supabase
    .from('customer_details')
    .select('*')
    .eq('customer_id', customerId)
    .maybeSingle();
  
  if (detailsError) {
    console.error('Error fetching customer details:', detailsError);
    return null;
  }
  
  return detailsData;
};
