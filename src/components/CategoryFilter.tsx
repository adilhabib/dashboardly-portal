
import React from 'react';
import { useCategories } from '@/hooks/useCategories';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onSelectCategory 
}) => {
  const { categories, isLoading } = useCategories();

  if (isLoading) {
    return <div className="h-10 w-full bg-gray-100 animate-pulse rounded-md"></div>;
  }

  return (
    <div className="mb-6">
      <h2 className="text-sm font-medium mb-2 text-gray-500">Filter by category</h2>
      <Tabs 
        defaultValue={selectedCategory || 'all'} 
        onValueChange={(value) => onSelectCategory(value === 'all' ? null : value)}
      >
        <TabsList className="w-full overflow-x-auto flex-nowrap justify-start">
          <TabsTrigger value="all" className="px-4">
            All
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.name} 
              className="px-4"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default CategoryFilter;
