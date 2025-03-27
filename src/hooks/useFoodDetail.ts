
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFoodDetails, createFoodDetails } from '@/services/foodService';
import { FoodDetail } from '@/types/food';

export const useFoodDetail = (foodId: string | null) => {
  console.log('useFoodDetail hook called with foodId:', foodId);
  
  const queryClient = useQueryClient();
  const [isCreatingDetails, setIsCreatingDetails] = useState(false);

  // Query for fetching the food details
  const detailsQuery = useQuery({
    queryKey: ['foodDetails', foodId],
    queryFn: () => fetchFoodDetails(foodId || ''),
    enabled: !!foodId,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for fetching the food
  const foodQuery = useQuery({
    queryKey: ['food', foodId],
    queryFn: async () => {
      console.log('Fetching food with ID:', foodId);
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .eq('id', foodId)
        .single();
      
      if (error) {
        console.error('Error fetching food:', error);
        throw error;
      }
      
      console.log('Food data fetched:', data);
      return data;
    },
    enabled: !!foodId,
  });

  console.log('foodQuery state:', {
    isLoading: foodQuery.isLoading,
    isError: foodQuery.isError,
    data: foodQuery.data,
    error: foodQuery.error
  });

  // Mutation for creating food details
  const createDetailsMutation = useMutation({
    mutationFn: async (foodId: string) => {
      setIsCreatingDetails(true);
      try {
        return await createFoodDetails({
          food_id: foodId,
          ingredients: '',
          allergens: '',
          preparation_time: 30, // Default value
          calories: 0 // Default value
        });
      } finally {
        setIsCreatingDetails(false);
      }
    },
    onSuccess: (data) => {
      console.log('Food details created successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['foodDetails', foodId] });
    },
    onError: (error) => {
      console.error('Error creating food details:', error);
    }
  });

  // Function to create food details
  const createDetails = (foodId: string) => {
    console.log('Creating food details for foodId:', foodId);
    createDetailsMutation.mutate(foodId);
  };

  return {
    food: foodQuery.data,
    details: detailsQuery.data,
    isLoading: foodQuery.isLoading || detailsQuery.isLoading,
    isError: foodQuery.isError || detailsQuery.isError,
    error: foodQuery.error || detailsQuery.error,
    createDetails,
    isCreatingDetails
  };
};

import { supabase } from '@/integrations/supabase/client';
