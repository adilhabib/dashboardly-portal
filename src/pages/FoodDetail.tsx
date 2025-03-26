
import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Clock, Utensils, AlertCircle, Plus } from 'lucide-react';
import { fetchFoodDetails, createFoodDetails } from '@/services/foodService';
import { Food, FoodDetail as FoodDetailType } from '@/types/food';
import { toast } from 'sonner';
import PageBreadcrumb from '@/components/PageBreadcrumb';

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
      
      <div className="mb-6">
        <Link to="/foods">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Foods
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-sm mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold">{food.name}</CardTitle>
                  {food.category && (
                    <CardDescription>{food.category}</CardDescription>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={food.is_available ? "default" : "secondary"}>
                    {food.is_available ? "Available" : "Unavailable"}
                  </Badge>
                  <Link to={`/foods?edit=${food.id}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Edit size={16} />
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {food.image_url ? (
                    <img 
                      src={food.image_url} 
                      alt={food.name} 
                      className="w-full h-60 object-cover rounded-md mb-4"
                    />
                  ) : (
                    <div className="w-full h-60 bg-gray-200 rounded-md flex items-center justify-center mb-4">
                      <p className="text-gray-500">No image available</p>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p className="text-gray-700">{food.description || 'No description provided'}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Details</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Price</span>
                        <span className="font-medium">PKR {food.price.toFixed(2)}</span>
                      </div>
                      
                      {details && details.preparation_time && (
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Clock size={16} />
                            <span>Preparation Time</span>
                          </div>
                          <span className="font-medium">{details.preparation_time} min</span>
                        </div>
                      )}
                      
                      {details && details.calories && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Calories</span>
                          <span className="font-medium">{details.calories} kcal</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {details && details.ingredients ? (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Utensils size={18} className="text-gray-500" />
                        <h3 className="text-lg font-medium">Ingredients</h3>
                      </div>
                      <p className="text-gray-700">{details.ingredients}</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Utensils size={18} className="text-gray-500" />
                        <h3 className="text-lg font-medium">Ingredients</h3>
                      </div>
                      <p className="text-gray-500 italic">No ingredients information available</p>
                    </div>
                  )}
                  
                  {details && details.allergens ? (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={18} className="text-amber-500" />
                        <h3 className="text-lg font-medium">Allergens</h3>
                      </div>
                      <p className="text-gray-700">{details.allergens}</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={18} className="text-amber-500" />
                        <h3 className="text-lg font-medium">Allergens</h3>
                      </div>
                      <p className="text-gray-500 italic">No allergens information available</p>
                    </div>
                  )}
                </div>
              </div>
              
              {!details && (
                <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600">No detailed information available for this food item</p>
                    <Button 
                      size="sm" 
                      onClick={() => foodId && createDetailsMutation.mutate(foodId)}
                      disabled={createDetailsMutation.isPending}
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} />
                      {createDetailsMutation.isPending ? 'Creating...' : 'Create Details'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="shadow-sm mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Price History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No price history available</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Order Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Orders Including This Item</h3>
                  <p className="text-2xl font-bold mt-1">0</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Revenue Generated</h3>
                  <p className="text-2xl font-bold mt-1">PKR 0.00</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Ordered</h3>
                  <p className="font-medium mt-1">Never</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
