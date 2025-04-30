
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { fetchCustomers } from '@/services/customerService';
import { supabase } from '@/integrations/supabase/client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  customerId: z.string().uuid({ message: "Please select a customer" }),
  amount: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be greater than 0",
  }),
  orderId: z.string().optional(),
  creditorName: z.string().min(2, { message: "Creditor name must be at least 2 characters" }),
  creditorContact: z.string().optional(),
  description: z.string().min(3, { message: "Description must be at least 3 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const CreditRecordingForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: "",
      amount: "",
      orderId: "",
      creditorName: "",
      creditorContact: "",
      description: "",
    },
  });
  
  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const amount = parseFloat(data.amount);
      
      // Record the credit as a financial transaction
      const { data: transaction, error: transactionError } = await supabase.rpc(
        'record_financial_transaction',
        {
          p_amount: amount,
          p_type: 'income',
          p_description: `Credit from customer: ${data.description} ${data.orderId ? `- Order #${data.orderId}` : ''} - Authorized by: ${data.creditorName} ${data.creditorContact ? `(${data.creditorContact})` : ''}`
        }
      );
      
      if (transactionError) throw transactionError;
      
      // First call RPC function to increment loyalty points, then update the customer record
      const { data: newPoints, error: incrementError } = await supabase.rpc(
        'increment_loyalty_points', 
        { 
          customer_id: data.customerId, 
          points_to_add: amount 
        }
      );
      
      if (incrementError) throw incrementError;
      
      toast({
        title: "Credit recorded successfully",
        description: `Credit of ${amount.toFixed(2)} has been recorded`,
      });
      
      form.reset();
    } catch (error) {
      console.error('Error recording credit:', error);
      toast({
        title: "Error recording credit",
        description: "An error occurred while recording the credit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isLoadingCustomers}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers?.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} ({customer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input {...field} type="number" step="0.01" min="0" placeholder="0.00" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="creditorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Creditor Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Name of who authorized credit" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="creditorContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Creditor Contact (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Phone or email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="orderId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order ID (Optional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter order ID if applicable" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter reason for credit" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Recording Credit...
            </>
          ) : (
            "Record Credit"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CreditRecordingForm;
