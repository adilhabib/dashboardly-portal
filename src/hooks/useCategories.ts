
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/services/categoryService';
import { Category } from '@/types/category';

export function useCategories() {
  const { 
    data: categories, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  return {
    categories: categories || [],
    isLoading,
    isError
  };
}
