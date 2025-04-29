
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditFormValues } from './schema';

export const useSubmitCredit = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const submitCredit = async (data: CreditFormValues) => {
    setIsSubmitting(true);
    
    try {
      const amount = parseFloat(data.amount);
      
      // Record the credit as a financial transaction
      const { data: transaction, error: transactionError } = await supabase.rpc(
        'record_financial_transaction',
        {
          p_amount: amount,
          p_type: 'income',
          p_description: `Credit for ${data.customerName} (${data.customerEmail}): ${data.description} ${data.orderId ? `- Order #${data.orderId}` : ''} - Authorized by: ${data.creditorName} ${data.creditorContact ? `(${data.creditorContact})` : ''}`
        }
      );
      
      if (transactionError) throw transactionError;
      
      toast({
        title: "Credit recorded successfully",
        description: `Credit of ${amount.toFixed(2)} has been recorded for ${data.customerName}`,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error recording credit:', error);
      toast({
        title: "Error recording credit",
        description: "An error occurred while recording the credit. Please try again.",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    submitCredit,
    isSubmitting
  };
};
