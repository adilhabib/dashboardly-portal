
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  customerName: z.string().min(2, { message: "Customer name must be at least 2 characters" }),
  customerEmail: z.string().email({ message: "Please enter a valid email address" }),
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
      customerName: "",
      customerEmail: "",
      amount: "",
      orderId: "",
      creditorName: "",
      creditorContact: "",
      description: "",
    },
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
          p_description: `Credit for ${data.customerName} (${data.customerEmail}): ${data.description} ${data.orderId ? `- Order #${data.orderId}` : ''} - Authorized by: ${data.creditorName} ${data.creditorContact ? `(${data.creditorContact})` : ''}`
        }
      );
      
      if (transactionError) throw transactionError;
      
      toast({
        title: "Credit recorded successfully",
        description: `Credit of ${amount.toFixed(2)} has been recorded for ${data.customerName}`,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter customer name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="customer@example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
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
