
import { useState } from 'react';
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
    isError,
    refetch
  } = useQuery({
    queryKey: ['foodImages', foodId],
    queryFn: () => foodId ? getFoodImages(foodId) : Promise.resolve([]),
    enabled: !!foodId, // Only run the query if foodId exists
    staleTime: 1000 * 60, // 1 minute
  });

  // Upload image mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      setIsUploading(true);
      try {
        if (!foodId) {
          throw new Error('Food ID is required to upload images');
        }
        
        console.log('Starting image upload for food:', foodId);
        const imageUrl = await uploadFoodImage(file);
        
        if (!imageUrl) {
          throw new Error('Failed to upload image');
        }
        
        // Determine if this is the first image (should be primary)
        const isPrimary = !images || images.length === 0;
        console.log('Is this the primary image?', isPrimary);
        
        // Add the image to the database
        return await addFoodImage(foodId, imageUrl, isPrimary);
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: () => {
      if (foodId) {
        queryClient.invalidateQueries({ queryKey: ['foodImages', foodId] });
        queryClient.invalidateQueries({ queryKey: ['foods'] });
      }
      toast.success('Image uploaded successfully');
      refetch();
    },
    onError: (error) => {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error'));
    },
  });

  // Delete image mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ imageUrl, imageId }: { imageUrl: string, imageId: string }) => {
      return await deleteFoodImage(imageUrl, imageId);
    },
    onSuccess: () => {
      if (foodId) {
        queryClient.invalidateQueries({ queryKey: ['foodImages', foodId] });
        queryClient.invalidateQueries({ queryKey: ['foods'] });
      }
      toast.success('Image deleted successfully');
      refetch();
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
      if (foodId) {
        queryClient.invalidateQueries({ queryKey: ['foodImages', foodId] });
        queryClient.invalidateQueries({ queryKey: ['foods'] });
      }
      toast.success('Primary image updated');
      refetch();
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
    
    uploadMutation.mutate(file);
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
    handleSetPrimary,
    refetch
  };
}
