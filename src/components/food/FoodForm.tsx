
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
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
  foodId?: string | null;
}

const FoodForm: React.FC<FoodFormProps> = ({
  defaultValues,
  isSubmitting,
  onSubmit,
  onCancel,
  submitLabel,
  foodId = null,
}) => {
  const form = useForm<FoodFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues.name || '',
      description: defaultValues.description || '',
      price: defaultValues.price || 0,
      image_url: defaultValues.image_url || '',
      category: defaultValues.category || '',
      is_available: defaultValues.is_available !== undefined ? defaultValues.is_available : true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FoodFormFields control={form.control} foodId={foodId} />
        
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
