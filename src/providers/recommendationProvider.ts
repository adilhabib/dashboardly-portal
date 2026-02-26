import { useQuery } from '@tanstack/react-query';
import { fetchFoods } from '@/services/foodService';
import { fetchOrders, type Order } from '@/services/order';
import AIService from '@/services/aiService';
import type { Food } from '@/types/food';

type RecommendationResult = {
  products: Food[];
  history: Order[];
};

export const useRecommendedProducts = () => {
  return useQuery<RecommendationResult>({
    queryKey: ['ai-recommended-products'],
    queryFn: async () => {
      const [allProducts, history] = await Promise.all([fetchFoods(), fetchOrders()]);
      const products = await AIService.getRecommendedProducts(allProducts, history);
      return { products, history };
    },
    staleTime: 10 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000,
  });
};
