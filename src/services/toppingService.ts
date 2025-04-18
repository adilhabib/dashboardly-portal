
import { supabase } from "@/integrations/supabase/client";

export interface FoodTopping {
  id: string;
  food_id: string;
  name: string;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const fetchToppings = async (foodId: string) => {
  const { data, error } = await supabase
    .from('food_toppings')
    .select('*')
    .eq('food_id', foodId)
    .order('name');
    
  if (error) {
    console.error('Error fetching toppings:', error);
    throw error;
  }
  
  return data as FoodTopping[];
};

export const createTopping = async (topping: Omit<FoodTopping, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('food_toppings')
    .insert(topping)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating topping:', error);
    throw error;
  }
  
  return data as FoodTopping;
};

export const updateTopping = async (id: string, topping: Partial<Omit<FoodTopping, 'id' | 'created_at' | 'updated_at'>>) => {
  const { data, error } = await supabase
    .from('food_toppings')
    .update(topping)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating topping:', error);
    throw error;
  }
  
  return data as FoodTopping;
};

export const deleteTopping = async (id: string) => {
  const { error } = await supabase
    .from('food_toppings')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting topping:', error);
    throw error;
  }
  
  return true;
};
