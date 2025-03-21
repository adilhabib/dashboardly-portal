
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Food } from '@/types/food';
import FoodFormFields from './FoodFormFields';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  image_url: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  is_available: z.boolean().default(true),
});

export type FoodFormValues = z.infer<typeof formSchema>;

interface FoodFormProps {
  defaultValues: FoodFormValues;
  isSubmitting: boolean;
  onSubmit: (values: FoodFormValues) => void;
  onCancel: () => void;
  submitLabel: string;
}

const FoodForm: React.FC<FoodFormProps> = ({
  defaultValues,
  isSubmitting,
  onSubmit,
  onCancel,
  submitLabel,
}) => {
  const form = useForm<FoodFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FoodFormFields control={form.control} />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FoodForm;
