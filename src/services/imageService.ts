
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'food_images';

// Upload an image to Supabase storage
export const uploadFoodImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log('Uploading image to storage:', { fileName, filePath, bucket: BUCKET_NAME });

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Get the public URL for the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    console.log('Image uploaded successfully:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadFoodImage:', error);
    return null;
  }
};

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
