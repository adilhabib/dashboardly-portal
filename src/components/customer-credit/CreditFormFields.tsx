
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CreditFormValues } from './schema';

export const CreditFormFields = () => {
  const { control } = useFormContext<CreditFormValues>();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
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
          control={control}
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
        control={control}
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
          control={control}
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
          control={control}
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
        control={control}
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
        control={control}
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
    </>
  );
};
