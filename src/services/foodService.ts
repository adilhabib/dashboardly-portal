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
  console.log('fetchFoodDetails called for foodId:', foodId);
  
  const { data, error } = await supabase
    .from('food_details')
    .select('*')
    .eq('food_id', foodId)
    .single();
  
  if (error) {
    // Instead of throwing error for PGRST116 (not found), 
    // just log it but return null to handle the case properly
    if (error.code === 'PGRST116') {
      console.log(`No food details found for food ID: ${foodId}`);
      return null;
    }
    
    console.error('Error fetching food details:', error);
    throw error;
  }
  
  console.log('Food details fetched successfully:', data);
  return data as FoodDetail;
};

export const createFoodDetails = async (foodDetails: Omit<FoodDetail, 'id' | 'created_at' | 'updated_at'>) => {
  console.log('Creating food details with data:', foodDetails);
  
  const { data, error } = await supabase
    .from('food_details')
    .insert(foodDetails)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating food details:', error);
    throw error;
  }
  
  console.log('Food details created successfully:', data);
  return data as FoodDetail;
};

export const updateFoodDetails = async (id: string, foodDetails: Partial<Omit<FoodDetail, 'id' | 'created_at' | 'updated_at'>>) => {
  const { data, error } = await supabase
    .from('food_details')
    .update(foodDetails)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating food details:', error);
    throw error;
  }
  
  return data as FoodDetail;
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
