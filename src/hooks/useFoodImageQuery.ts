
import { useQuery } from '@tanstack/react-query';
import { getFoodImages } from '@/services/imageService';

export interface FoodImage {
  id: string;
  food_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function useFoodImageQuery(foodId: string | null) {
  const { 
    data: images, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['foodImages', foodId],
    queryFn: () => getFoodImages(foodId as string),
    enabled: !!foodId, // Only run the query if foodId exists
  });

  return {
    images: images || [],
    isLoading,
    isError
  };
}
