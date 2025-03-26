
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { fetchFoodDetails, createFoodDetails } from '@/services/foodService';
import { Food, FoodDetail as FoodDetailType } from '@/types/food';
import { 
  FoodHeader, 
  FoodImageSection, 
  FoodDetailsSection, 
  FoodStats,
  BackButton
} from '@/components/food-detail';

const fetchFood = async (foodId: string): Promise<{ food: Food, details: FoodDetailType | null }> => {
  const { data: food, error } = await supabase
    .from('foods')
    .select('*')
    .eq('id', foodId)
    .single();
  
  if (error) {
    console.error('Error fetching food:', error);
    throw error;
  }
  
  const details = await fetchFoodDetails(foodId);
  
  return { food, details };
};

const FoodDetail = () => {
  const [searchParams] = useSearchParams();
  const foodId = searchParams.get('id');
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['food', foodId],
    queryFn: () => fetchFood(foodId || ''),
    enabled: !!foodId,
  });

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

  if (isLoading) {
    return <div className="text-center py-10">Loading food details...</div>;
  }

  if (isError || !data || !data.food) {
    return <div className="text-center py-10 text-red-500">Error loading food details</div>;
  }

  const { food, details } = data;

  return (
    <div className="container mx-auto px-4 py-6">
      <PageBreadcrumb pageName="Food Details" />
      
      <BackButton />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-sm mb-6">
            <CardHeader className="pb-2">
              <FoodHeader food={food} />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FoodImageSection food={food} />
                <FoodDetailsSection 
                  price={food.price}
                  details={details}
                  onCreateDetails={() => foodId && createDetailsMutation.mutate(foodId)}
                  isCreatingDetails={createDetailsMutation.isPending}
                  foodId={foodId}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <FoodStats />
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
