
import { supabase } from '@/integrations/supabase/client';
import { Category, SubCategory } from '@/types/category';

// Fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  // Fetch subcategories for each category
  const categoriesWithSubs = await Promise.all(
    data.map(async (category) => {
      const { data: subcategories, error: subError } = await supabase
        .from('subcategories')
        .select('*')
        .eq('parent_id', category.id)
        .order('name');

      if (subError) {
        console.error('Error fetching subcategories:', subError);
        return category;
      }

      return {
        ...category,
        subcategories: subcategories || []
      };
    })
  );

  return categoriesWithSubs || [];
};

// Create a new category
export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    throw error;
  }

  return data;
};

// Update an existing category
export const updateCategory = async (category: Category): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .update({
      name: category.name,
      description: category.description
    })
    .eq('id', category.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating category:', error);
    throw error;
  }

  return data;
};

// Delete a category
export const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// Fetch all subcategories
export const fetchSubcategories = async (): Promise<SubCategory[]> => {
  const { data, error } = await supabase
    .from('subcategories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }

  return data || [];
};

// Fetch subcategories for a specific parent category
export const fetchSubcategoriesByParent = async (parentId: string): Promise<SubCategory[]> => {
  const { data, error } = await supabase
    .from('subcategories')
    .select('*')
    .eq('parent_id', parentId)
    .order('name');

  if (error) {
    console.error('Error fetching subcategories by parent:', error);
    throw error;
  }

  return data || [];
};

// Create a new subcategory
export const createSubcategory = async (subcategory: Omit<SubCategory, 'id'>): Promise<SubCategory> => {
  const { data, error } = await supabase
    .from('subcategories')
    .insert({
      name: subcategory.name,
      description: subcategory.description,
      parent_id: subcategory.parentId
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating subcategory:', error);
    throw error;
  }

  return data;
};

// Update an existing subcategory
export const updateSubcategory = async (subcategory: SubCategory): Promise<SubCategory> => {
  const { data, error } = await supabase
    .from('subcategories')
    .update({
      name: subcategory.name,
      description: subcategory.description,
      parent_id: subcategory.parentId
    })
    .eq('id', subcategory.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating subcategory:', error);
    throw error;
  }

  return data;
};

// Delete a subcategory
export const deleteSubcategory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('subcategories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting subcategory:', error);
    throw error;
  }
};
