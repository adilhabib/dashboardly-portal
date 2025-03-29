
import { supabase } from "@/integrations/supabase/client";
import { FoodSize } from "@/types/food";

export const fetchFoodSizes = async (foodId: string): Promise<FoodSize[]> => {
  const { data, error } = await supabase
    .from('food_sizes')
    .select('*')
    .eq('food_id', foodId)
    .order('price');
  
  if (error) {
    console.error('Error fetching food sizes:', error);
    throw error;
  }
  
  return data || [];
};

export const createFoodSize = async (foodSize: Omit<FoodSize, 'id' | 'created_at' | 'updated_at'>): Promise<FoodSize> => {
  const { data, error } = await supabase
    .from('food_sizes')
    .insert(foodSize)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating food size:', error);
    throw error;
  }
  
  return data;
};

export const updateFoodSize = async (id: string, foodSize: Partial<Omit<FoodSize, 'id' | 'created_at' | 'updated_at'>>): Promise<FoodSize> => {
  const { data, error } = await supabase
    .from('food_sizes')
    .update(foodSize)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating food size:', error);
    throw error;
  }
  
  return data;
};

export const deleteFoodSize = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('food_sizes')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting food size:', error);
    throw error;
  }
  
  return true;
};

export const setDefaultFoodSize = async (foodId: string, sizeId: string): Promise<void> => {
  // First, clear all default flags for this food
  const { error: clearError } = await supabase
    .from('food_sizes')
    .update({ is_default: false })
    .eq('food_id', foodId);
  
  if (clearError) {
    console.error('Error clearing default food sizes:', clearError);
    throw clearError;
  }
  
  // Then set the new default
  const { error: setError } = await supabase
    .from('food_sizes')
    .update({ is_default: true })
    .eq('id', sizeId);
  
  if (setError) {
    console.error('Error setting default food size:', setError);
    throw setError;
  }
};
