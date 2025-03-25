
import { supabase } from "@/integrations/supabase/client";

// Add an image to the food_images table
export const addFoodImage = async (
  foodId: string, 
  imageUrl: string, 
  isPrimary: boolean = false,
  displayOrder: number = 0
): Promise<any> => {
  try {
    console.log('Adding image to food_images table:', { foodId, imageUrl, isPrimary });
    
    // If this is the primary image, update existing primary images to non-primary
    if (isPrimary) {
      const { error: updateError } = await supabase
        .from('food_images')
        .update({ is_primary: false })
        .eq('food_id', foodId)
        .eq('is_primary', true);
        
      if (updateError) {
        console.error('Error updating existing primary images:', updateError);
      }
    }

    const { data, error } = await supabase
      .from('food_images')
      .insert({
        food_id: foodId,
        image_url: imageUrl,
        is_primary: isPrimary,
        display_order: displayOrder
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding food image to database:', error);
      throw error;
    }

    console.log('Image added to food_images table:', data);
    
    // If this is the primary image, also update the main food record
    if (isPrimary) {
      const { error: foodUpdateError } = await supabase
        .from('foods')
        .update({ image_url: imageUrl })
        .eq('id', foodId);
        
      if (foodUpdateError) {
        console.error('Error updating food main image:', foodUpdateError);
      }
    }

    return data;
  } catch (error) {
    console.error('Error in addFoodImage:', error);
    throw error;
  }
};

// Get all images for a specific food item
export const getFoodImages = async (foodId: string) => {
  try {
    console.log('Fetching images for food:', foodId);
    
    const { data, error } = await supabase
      .from('food_images')
      .select('*')
      .eq('food_id', foodId)
      .order('is_primary', { ascending: false })
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching food images:', error);
      throw error;
    }

    console.log('Images fetched:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error in getFoodImages:', error);
    return [];
  }
};
