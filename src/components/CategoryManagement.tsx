
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
} from '@/services/categoryService';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import CategoryModal from './CategoryModal';
import SubcategoryModal from './SubcategoryModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Category, SubCategory } from '@/types/category';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const CategoryManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubCategory | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const { data: categories, isLoading, isError, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    retry: 1,
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    },
  });

  const createSubcategoryMutation = useMutation({
    mutationFn: createSubcategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Subcategory created successfully');
      setIsSubcategoryModalOpen(false);
    },
    onError: (error) => {
      console.error('Error creating subcategory:', error);
      toast.error('Failed to create subcategory');
    },
  });

  const updateSubcategoryMutation = useMutation({
    mutationFn: updateSubcategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Subcategory updated successfully');
      setIsSubcategoryModalOpen(false);
    },
    onError: (error) => {
      console.error('Error updating subcategory:', error);
      toast.error('Failed to update subcategory');
    },
  });

  const deleteSubcategoryMutation = useMutation({
    mutationFn: deleteSubcategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Subcategory deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting subcategory:', error);
      toast.error('Failed to delete subcategory');
    },
  });

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all subcategories.')) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const handleAddSubcategory = (categoryId: string) => {
    setSelectedSubcategory(null);
    setIsSubcategoryModalOpen(true);
    // Find the category to pre-fill the parent ID
    const category = categories?.find(cat => cat.id === categoryId);
    if (category) {
      setSelectedCategory(category);
    }
  };

  const handleEditSubcategory = (subcategory: SubCategory) => {
    setSelectedSubcategory(subcategory);
    setIsSubcategoryModalOpen(true);
  };

  const handleDeleteSubcategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      deleteSubcategoryMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleCloseSubcategoryModal = () => {
    setIsSubcategoryModalOpen(false);
    setSelectedSubcategory(null);
  };

  const handleSaveCategory = (category: Omit<Category, 'id'> | Category) => {
    if ('id' in category) {
      updateCategoryMutation.mutate(category as Category);
    } else {
      createCategoryMutation.mutate(category);
    }
  };

  const handleSaveSubcategory = (subcategory: Omit<SubCategory, 'id'> | SubCategory) => {
    if ('id' in subcategory) {
      updateSubcategoryMutation.mutate(subcategory as SubCategory);
    } else {
      createSubcategoryMutation.mutate(subcategory);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading categories...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-4">Error loading categories</div>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['categories'] })}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories Management</h1>
        <Button onClick={handleAddCategory} className="flex items-center gap-1">
          <Plus size={16} />
          Add New Category
        </Button>
      </div>

      {categories && categories.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Name</TableHead>
                <TableHead className="w-[40%]">Description</TableHead>
                <TableHead className="w-[20%]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <React.Fragment key={category.id}>
                  <TableRow className="group">
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-0 mr-2"
                          onClick={() => toggleCategory(category.id)}
                        >
                          {expandedCategories[category.id] ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </Button>
                        {category.name}
                      </div>
                    </TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">Actions</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                              <Edit2 size={16} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAddSubcategory(category.id)}>
                              <Plus size={16} className="mr-2" />
                              Add Subcategory
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} className="mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* Display subcategories if expanded */}
                  {expandedCategories[category.id] && category.subcategories && category.subcategories.map((subcategory) => (
                    <TableRow key={subcategory.id} className="bg-slate-50">
                      <TableCell className="pl-10">
                        <span className="text-sm">— {subcategory.name}</span>
                      </TableCell>
                      <TableCell className="text-sm">{subcategory.description}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditSubcategory(subcategory)}
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteSubcategory(subcategory.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No categories available</p>
          <Button onClick={handleAddCategory} className="mt-4">
            Add Your First Category
          </Button>
        </div>
      )}

      {isModalOpen && (
        <CategoryModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          onSave={handleSaveCategory}
          category={selectedCategory}
        />
      )}

      {isSubcategoryModalOpen && (
        <SubcategoryModal 
          isOpen={isSubcategoryModalOpen} 
          onClose={handleCloseSubcategoryModal} 
          onSave={handleSaveSubcategory}
          subcategory={selectedSubcategory}
          parentCategoryId={selectedCategory?.id}
        />
      )}
    </div>
  );
};

export default CategoryManagement;
