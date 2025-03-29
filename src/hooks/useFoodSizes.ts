
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchFoodSizes, 
  createFoodSize, 
  updateFoodSize, 
  deleteFoodSize,
  setDefaultFoodSize
} from '@/services/foodSizeService';
import { FoodSize } from '@/types/food';

export function useFoodSizes(foodId: string | null) {
  const queryClient = useQueryClient();
  
  const { 
    data: sizes, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['foodSizes', foodId],
    queryFn: () => fetchFoodSizes(foodId || ''),
    enabled: !!foodId,
  });

  const createMutation = useMutation({
    mutationFn: createFoodSize,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodSizes', foodId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<FoodSize, 'id' | 'created_at' | 'updated_at'>> }) => 
      updateFoodSize(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodSizes', foodId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFoodSize,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodSizes', foodId] });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: ({ foodId, sizeId }: { foodId: string; sizeId: string }) => 
      setDefaultFoodSize(foodId, sizeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodSizes', foodId] });
    },
  });

  return {
    sizes: sizes || [],
    isLoading,
    isError,
    createSize: createMutation.mutate,
    updateSize: updateMutation.mutate,
    deleteSize: deleteMutation.mutate,
    setDefaultSize: setDefaultMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isSettingDefault: setDefaultMutation.isPending
  };
}
