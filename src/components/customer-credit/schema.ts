
import { z } from 'zod';

export const creditFormSchema = z.object({
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

export type CreditFormValues = z.infer<typeof creditFormSchema>;
