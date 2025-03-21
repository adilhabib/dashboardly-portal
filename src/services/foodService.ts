
import { supabase } from "@/integrations/supabase/client";
import { Food, FoodDetail } from "@/types/food";

export const fetchFoods = async () => {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching foods:', error);
    throw error;
  }
  
  return data as Food[];
};

export const fetchFoodDetails = async (foodId: string) => {
  const { data, error } = await supabase
    .from('food_details')
    .select('*')
    .eq('food_id', foodId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is the "not found" error code
    console.error('Error fetching food details:', error);
    throw error;
  }
  
  return data as FoodDetail | null;
};

export const createFood = async (food: Omit<Food, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('foods')
    .insert(food)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating food:', error);
    throw error;
  }
  
  return data as Food;
};

export const updateFood = async (id: string, food: Partial<Omit<Food, 'id' | 'created_at' | 'updated_at'>>) => {
  const { data, error } = await supabase
    .from('foods')
    .update(food)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating food:', error);
    throw error;
  }
  
  return data as Food;
};

export const deleteFood = async (id: string) => {
  const { error } = await supabase
    .from('foods')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting food:', error);
    throw error;
  }
  
  return true;
};
