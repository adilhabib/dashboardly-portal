
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FoodDetail } from '@/types/food';
import { updateFoodDetails } from '@/services/foodService';
import { toast } from 'sonner';

const formSchema = z.object({
  calories: z.coerce.number().min(0, 'Calories must be a positive number').nullable(),
  preparation_time: z.coerce.number().min(1, 'Preparation time must be at least 1 minute').nullable(),
  ingredients: z.string().nullable(),
  allergens: z.string().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface FoodDetailFormProps {
  details: FoodDetail;
  onCancel: () => void;
  onSaved: () => void;
}

const FoodDetailForm: React.FC<FoodDetailFormProps> = ({ details, onCancel, onSaved }) => {
  const queryClient = useQueryClient();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      calories: details.calories,
      preparation_time: details.preparation_time,
      ingredients: details.ingredients,
      allergens: details.allergens,
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Omit<FoodDetail, 'id' | 'created_at' | 'updated_at'>>) => 
      updateFoodDetails(details.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodDetails', details.food_id] });
      toast.success('Food details updated successfully');
      onSaved();
    },
    onError: (error) => {
      console.error('Error updating food details:', error);
      toast.error('Failed to update food details');
    },
  });

  const onSubmit = (values: FormValues) => {
    updateMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="calories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calories (kcal)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter calories" 
                  {...field} 
                  value={field.value === null ? '' : field.value}
                  onChange={(e) => {
                    const value = e.target.value === '' ? null : Number(e.target.value);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preparation_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preparation Time (minutes)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter preparation time" 
                  {...field} 
                  value={field.value === null ? '' : field.value}
                  onChange={(e) => {
                    const value = e.target.value === '' ? null : Number(e.target.value);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ingredients"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ingredients</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter ingredients" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allergens"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allergens</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter allergens" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FoodDetailForm;
