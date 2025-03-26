
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFoodImage, setPrimaryFoodImage } from '@/services/imageService';
import { toast } from 'sonner';

export function useImageManagement(foodId: string | null) {
  const queryClient = useQueryClient();

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

  const handleDelete = (imageUrl: string, imageId: string) => {
    deleteMutation.mutate({ imageUrl, imageId });
  };

  const handleSetPrimary = (imageId: string) => {
    setPrimaryMutation.mutate(imageId);
  };

  return {
    handleDelete,
    handleSetPrimary
  };
}
