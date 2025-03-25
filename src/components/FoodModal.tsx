
import React, { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFood, updateFood } from '@/services/foodService';
import { Food } from '@/types/food';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import FoodForm, { FoodFormValues } from './food/FoodForm';

interface FoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: Food | null;
}

const FoodModal: React.FC<FoodModalProps> = ({ isOpen, onClose, food }) => {
  const queryClient = useQueryClient();
  const isEditing = !!food;

  // Default values for the form
  const defaultValues: FoodFormValues = {
    name: food?.name || '',
    description: food?.description || '',
    price: food?.price || 0,
    image_url: food?.image_url || '',
    category: food?.category || '',
    is_available: food?.is_available ?? true,
  };

  const createMutation = useMutation({
    mutationFn: createFood,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
      toast.success('Food item created successfully');
      onClose();
    },
    onError: (error) => {
      console.error('Error creating food:', error);
      toast.error('Failed to create food item');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Food> }) => 
      updateFood(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
      toast.success('Food item updated successfully');
      onClose();
    },
    onError: (error) => {
      console.error('Error updating food:', error);
      toast.error('Failed to update food item');
    },
  });

  const onSubmit = (values: FoodFormValues) => {
    if (isEditing && food) {
      updateMutation.mutate({ id: food.id, data: values });
    } else {
      // Ensure required fields are present for creating a new food item
      createMutation.mutate({
        name: values.name,
        description: values.description,
        price: values.price,
        image_url: values.image_url,
        category: values.category,
        is_available: values.is_available
      });
    }
  };

  // When a food is loaded for editing, invalidate its images query to refresh
  useEffect(() => {
    if (isOpen && isEditing && food) {
      queryClient.invalidateQueries({ queryKey: ['foodImages', food.id] });
    }
  }, [isOpen, isEditing, food, queryClient]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Food Item' : 'Add New Food'}</DialogTitle>
        </DialogHeader>
        
        <FoodForm
          defaultValues={defaultValues}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onSubmit={onSubmit}
          onCancel={onClose}
          submitLabel={isEditing ? 'Update' : 'Create'}
          foodId={food?.id || null}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FoodModal;
