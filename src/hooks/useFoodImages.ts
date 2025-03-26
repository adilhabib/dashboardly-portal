
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getFoodImages, 
  uploadFoodImage, 
  addFoodImage, 
  deleteFoodImage,
  setPrimaryFoodImage
} from '@/services/imageService';
import { toast } from 'sonner';

interface FoodImage {
  id: string;
  food_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function useFoodImages(foodId: string | null) {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  // Fetch images for the food item
  const { 
    data: images, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['foodImages', foodId],
    queryFn: () => getFoodImages(foodId as string),
    enabled: !!foodId, // Only run the query if foodId exists
  });

  // Upload image mutation
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
        const isPrimary = !images || images.length === 0;
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

  // Delete image mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ imageUrl, imageId }: { imageUrl: string, imageId: string }) => {
      return await deleteFoodImage(imageUrl, imageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodImages', foodId] });
      toast.success('Image deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    },
  });

  // Set primary image mutation
  const setPrimaryMutation = useMutation({
    mutationFn: async (imageId: string) => {
      if (!foodId) return false;
      return await setPrimaryFoodImage(foodId, imageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodImages', foodId] });
      toast.success('Primary image updated');
    },
    onError: (error) => {
      console.error('Error setting primary image:', error);
      toast.error('Failed to update primary image');
    },
  });

  const handleUpload = async (file: File) => {
    if (!foodId) {
      toast.error('Please save the food item first before uploading images');
      return;
    }
    
    await uploadMutation.mutateAsync(file);
  };

  const handleDelete = (imageUrl: string, imageId: string) => {
    deleteMutation.mutate({ imageUrl, imageId });
  };

  const handleSetPrimary = (imageId: string) => {
    setPrimaryMutation.mutate(imageId);
  };

  return {
    images: images || [],
    isLoading,
    isError,
    isUploading,
    handleUpload,
    handleDelete,
    handleSetPrimary
  };
}
