
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FoodFormValues } from './FoodForm';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useCategories, useSubcategories } from '@/hooks/useCategories';
import FoodImageGallery from './FoodImageGallery';

interface FoodFormFieldsProps {
  form: UseFormReturn<FoodFormValues>;
  foodId: string | null;
}

const FoodFormFields: React.FC<FoodFormFieldsProps> = ({ form, foodId }) => {
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const selectedCategory = form.watch('category');
  const { subcategories, isLoading: isSubcategoriesLoading } = useSubcategories(selectedCategory || undefined);

  // Reset subcategory when category changes
  useEffect(() => {
    if (selectedCategory) {
      form.setValue('subcategory', '');
    }
  }, [selectedCategory, form]);

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Food Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter food name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter food description" 
                className="resize-none" 
                {...field} 
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                value={field.value || ''} 
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {selectedCategory && (
        <FormField
          control={form.control}
          name="subcategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategory</FormLabel>
              <Select 
                value={field.value || ''} 
                onValueChange={field.onChange}
                disabled={isSubcategoriesLoading || subcategories.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={
                      isSubcategoriesLoading 
                        ? "Loading subcategories..." 
                        : subcategories.length === 0 
                          ? "No subcategories available" 
                          : "Select a subcategory"
                    } />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {subcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="is_available"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Availability</FormLabel>
              <div className="text-sm text-muted-foreground">
                Is this food item available for ordering?
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {foodId && (
        <div className="pt-4">
          <FormLabel>Food Images</FormLabel>
          <FoodImageGallery foodId={foodId} />
        </div>
      )}
    </div>
  );
};

export default FoodFormFields;
