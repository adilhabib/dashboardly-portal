
import { supabase } from "@/integrations/supabase/client";
import { BUCKET_NAME } from "./constants";

// Delete an image from both storage and the database
export const deleteFoodImage = async (imageUrl: string, imageId: string) => {
  try {
    // Extract filename from URL to delete from storage
    const fileName = imageUrl.split('/').pop() || '';
    console.log('Deleting image from storage:', fileName);
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (storageError) {
      console.error('Error deleting image from storage:', storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('food_images')
      .delete()
      .eq('id', imageId);

    if (dbError) {
      console.error('Error deleting image from database:', dbError);
      throw dbError;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteFoodImage:', error);
    return false;
  }
};

// Set an image as the primary image
export const setPrimaryFoodImage = async (foodId: string, imageId: string) => {
  try {
    console.log('Setting primary image:', { foodId, imageId });
    
    // Get the image URL first
    const { data: imageData, error: imageError } = await supabase
      .from('food_images')
      .select('image_url')
      .eq('id', imageId)
      .single();
      
    if (imageError) {
      console.error('Error fetching image URL:', imageError);
      throw imageError;
    }
    
    // First, set all images for this food to non-primary
    const { error: updateAllError } = await supabase
      .from('food_images')
      .update({ is_primary: false })
      .eq('food_id', foodId);
      
    if (updateAllError) {
      console.error('Error resetting primary images:', updateAllError);
      throw updateAllError;
    }
    
    // Then set the selected image as primary
    const { error: updateImageError } = await supabase
      .from('food_images')
      .update({ is_primary: true })
      .eq('id', imageId);

    if (updateImageError) {
      console.error('Error setting primary image:', updateImageError);
      throw updateImageError;
    }
    
    // Update the main food record with the new primary image URL
    if (imageData?.image_url) {
      const { error: foodUpdateError } = await supabase
        .from('foods')
        .update({ image_url: imageData.image_url })
        .eq('id', foodId);
        
      if (foodUpdateError) {
        console.error('Error updating food main image:', foodUpdateError);
      }
    }

    return true;
  } catch (error) {
    console.error('Error in setPrimaryFoodImage:', error);
    return false;
  }
};
