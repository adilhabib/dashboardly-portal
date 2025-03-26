
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFoodDetails, createFoodDetails } from '@/services/foodService';
import { supabase } from '@/integrations/supabase/client';
import { Food, FoodDetail } from '@/types/food';
import { toast } from 'sonner';

// Function to fetch food data and its details
const fetchFood = async (foodId: string): Promise<{ food: Food, details: FoodDetail | null }> => {
  try {
    // Fetch the food item
    const { data: food, error } = await supabase
      .from('foods')
      .select('*')
      .eq('id', foodId)
      .single();
    
    if (error) {
      console.error('Error fetching food:', error);
      throw new Error(`Failed to load food: ${error.message}`);
    }
    
    if (!food) {
      throw new Error("Food item not found");
    }
    
    // Fetch the food details
    const details = await fetchFoodDetails(foodId);
    
    return { food, details };
  } catch (error) {
    console.error('Error in fetchFood:', error);
    throw error;
  }
};

export const useFoodDetail = (foodId: string | null) => {
  const queryClient = useQueryClient();

  // Query for fetching food data
  const foodQuery = useQuery({
    queryKey: ['food', foodId],
    queryFn: () => {
      if (!foodId) {
        throw new Error("Food ID is required");
      }
      return fetchFood(foodId);
    },
    enabled: !!foodId,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  // Mutation for creating food details
  const createDetailsMutation = useMutation({
    mutationFn: (foodId: string) => {
      return createFoodDetails({
        food_id: foodId,
        calories: null,
        ingredients: null,
        allergens: null,
        preparation_time: null
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food', foodId] });
      toast.success('Food details created successfully');
    },
    onError: (error) => {
      console.error('Error creating food details:', error);
      toast.error('Failed to create food details');
    }
  });

  return {
    food: foodQuery.data?.food,
    details: foodQuery.data?.details,
    isLoading: foodQuery.isLoading,
    isError: foodQuery.isError,
    error: foodQuery.error,
    createDetails: createDetailsMutation.mutate,
    isCreatingDetails: createDetailsMutation.isPending
  };
};
