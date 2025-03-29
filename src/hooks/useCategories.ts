
import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchSubcategoriesByParent } from '@/services/categoryService';
import { Category, SubCategory } from '@/types/category';

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

export function useSubcategories(parentId?: string) {
  const { 
    data: subcategories, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['subcategories', parentId],
    queryFn: () => parentId ? fetchSubcategoriesByParent(parentId) : [],
    enabled: !!parentId,
  });

  return {
    subcategories: subcategories || [],
    isLoading,
    isError
  };
}
