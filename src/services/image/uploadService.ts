
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { BUCKET_NAME } from "./constants";

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
