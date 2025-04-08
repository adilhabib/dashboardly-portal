
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { 
  fetchFoodSizes, 
  createFoodSize, 
  updateFoodSize, 
  deleteFoodSize,
  setDefaultFoodSize
} from '@/services/foodSizeService';
import { FoodSize } from '@/types/food';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  // Subscribe to real-time changes on food_sizes table
  useEffect(() => {
    if (!foodId) return;

    // Set up a real-time subscription for food sizes
    const channel = supabase
      .channel('food_sizes_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'food_sizes',
          filter: `food_id=eq.${foodId}`
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          // Invalidate the query to refetch data
          queryClient.invalidateQueries({ queryKey: ['foodSizes', foodId] });
          
          // Show toast notification based on the event
          const eventType = payload.eventType;
          const size = payload.new as FoodSize;
          
          if (eventType === 'INSERT') {
            toast.success(`Size "${size.size_name}" added`);
          } else if (eventType === 'UPDATE') {
            toast.success(`Size "${size.size_name}" updated`);
          } else if (eventType === 'DELETE') {
            toast.success('Size removed');
          }
        }
      )
      .subscribe();

    // Clean up subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [foodId, queryClient]);

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
