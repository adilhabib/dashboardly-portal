
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import FoodFormFields from './FoodFormFields';
import FoodImageGallery from './FoodImageGallery';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Define the schema for food item validation
const foodFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, {
    message: 'Price must be a positive number.',
  }),
  image_url: z.string().optional(),
  category: z.string().optional(),
  is_available: z.boolean().default(true),
  is_popular: z.boolean().optional().default(false),
});

// Type for the form values
export type FoodFormValues = z.infer<typeof foodFormSchema>;

interface FoodFormProps {
  defaultValues: FoodFormValues;
  isSubmitting: boolean;
  onSubmit: (values: FoodFormValues) => void;
  onCancel: () => void;
  submitLabel: string;
  foodId: string | null;
}

const FoodForm: React.FC<FoodFormProps> = ({
  defaultValues,
  isSubmitting,
  onSubmit,
  onCancel,
  submitLabel,
  foodId
}) => {
  // Initialize form with react-hook-form
  const form = useForm<FoodFormValues>({
    resolver: zodResolver(foodFormSchema),
    defaultValues,
  });

  const handleFormSubmit = (values: FoodFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FoodFormFields form={form} foodId={foodId} />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FoodForm;
