
import { supabase } from '@/integrations/supabase/client';
import { Category, SubCategory } from '@/types/category';

export const fetchCategories = async (): Promise<Category[]> => {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  // Transform the data to match our Category interface
  const formattedCategories: Category[] = categories.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description || undefined
  }));

  return formattedCategories;
};

export const fetchCategoriesWithSubcategories = async (): Promise<Category[]> => {
  // First, fetch all categories
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  // Then, fetch all subcategories
  const { data: subcategories, error: subError } = await supabase
    .from('subcategories')
    .select('*')
    .order('name');

  if (subError) {
    console.error('Error fetching subcategories:', subError);
    throw subError;
  }

  // Map subcategories to their parent categories
  const categoriesWithSubs: Category[] = categories.map(category => {
    const categorySubs = subcategories.filter(sub => sub.parent_id === category.id).map(sub => ({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      parentId: sub.parent_id
    }));

    return {
      id: category.id,
      name: category.name,
      description: category.description || undefined,
      subcategories: categorySubs
    };
  });

  return categoriesWithSubs;
};

export const fetchSubcategoriesByParent = async (parentId: string): Promise<SubCategory[]> => {
  const { data, error } = await supabase
    .from('subcategories')
    .select('*')
    .eq('parent_id', parentId)
    .order('name');

  if (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }

  // Transform the data to match our SubCategory interface
  const formattedSubcategories: SubCategory[] = data.map(sub => ({
    id: sub.id,
    name: sub.name,
    description: sub.description || undefined,
    parentId: sub.parent_id
  }));

  return formattedSubcategories;
};

export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .insert({ name: category.name, description: category.description })
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description || undefined
  };
};

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

  return {
    id: data.id,
    name: data.name,
    description: data.description || undefined,
    parentId: data.parent_id
  };
};

export const updateCategory = async (id: string, category: Partial<Omit<Category, 'id'>>): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .update({ name: category.name, description: category.description })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating category:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description || undefined
  };
};

export const updateSubcategory = async (id: string, subcategory: Partial<Omit<SubCategory, 'id'>>): Promise<SubCategory> => {
  const { data, error } = await supabase
    .from('subcategories')
    .update({
      name: subcategory.name,
      description: subcategory.description,
      parent_id: subcategory.parentId
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating subcategory:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description || undefined,
    parentId: data.parent_id
  };
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    throw error;
  }

  return true;
};

export const deleteSubcategory = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('subcategories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting subcategory:', error);
    throw error;
  }

  return true;
};
