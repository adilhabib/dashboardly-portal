
import { useFoodImageQuery, type FoodImage } from './useFoodImageQuery';
import { useImageUpload } from './useImageUpload';
import { useImageManagement } from './useImageManagement';

export type { FoodImage };

export function useFoodImages(foodId: string | null) {
  const { images, isLoading, isError } = useFoodImageQuery(foodId);
  const { isUploading, handleUpload } = useImageUpload(foodId);
  const { handleDelete, handleSetPrimary } = useImageManagement(foodId);

  return {
    images,
    isLoading,
    isError,
    isUploading,
    handleUpload,
    handleDelete,
    handleSetPrimary
  };
}
