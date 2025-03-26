
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadFoodImage, addFoodImage } from '@/services/imageService';
import { toast } from 'sonner';

export function useImageUpload(foodId: string | null) {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      setIsUploading(true);
      try {
        console.log('Starting image upload for food ID:', foodId);
        const imageUrl = await uploadFoodImage(file);
        console.log('Image upload result:', imageUrl);
        
        if (!imageUrl || !foodId) {
          throw new Error('Failed to upload image or invalid food ID');
        }
        
        // Determine if this is the first image (should be primary)
        const existingImages = queryClient.getQueryData<any[]>(['foodImages', foodId]) || [];
        const isPrimary = existingImages.length === 0;
        console.log('Is this a primary image?', isPrimary);
        
        // Add the image to the database
        return await addFoodImage(foodId, imageUrl, isPrimary);
      } catch (error) {
        console.error('Error in upload mutation:', error);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodImages', foodId] });
      toast.success('Image uploaded successfully');
    },
    onError: (error) => {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    },
  });

  const handleUpload = async (file: File) => {
    if (!foodId) {
      toast.error('Please save the food item first before uploading images');
      return;
    }
    
    await uploadMutation.mutateAsync(file);
  };

  return {
    isUploading,
    handleUpload
  };
}
