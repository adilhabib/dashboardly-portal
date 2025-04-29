
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategories';
import { FoodFormValues } from './FoodForm';
import FoodImageGallery from './FoodImageGallery';
import FoodSizeManager from './FoodSizeManager';
import FoodToppingManager from './FoodToppingManager';

interface FoodFormFieldsProps {
  form: UseFormReturn<FoodFormValues>;
  foodId: string | null;
}

const FoodFormFields: React.FC<FoodFormFieldsProps> = ({ form, foodId }) => {
  const { categories, isLoading } = useCategories();
  const { control, setValue } = form;

  const handleDefaultPriceChange = (price: number) => {
    setValue('price', price);
  };

  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Food name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Description (optional)" 
                {...field} 
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Price ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              {foodId && (
                <p className="text-xs text-muted-foreground">
                  This price will be updated when you set a default size.
                </p>
              )}
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Main Image URL</FormLabel>
            <FormControl>
              <Input 
                placeholder="Image URL (optional)" 
                {...field} 
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
            <p className="text-xs text-muted-foreground">
              This field will be automatically updated when you set a main image in the gallery.
            </p>
          </FormItem>
        )}
      />

      <Separator className="my-4" />
      
      {foodId && (
        <>
          <FoodImageGallery foodId={foodId} />
          <Separator className="my-4" />
        </>
      )}

      <FoodSizeManager foodId={foodId} onPriceChange={handleDefaultPriceChange} />
      
      <Separator className="my-4" />
      
      <div className="space-y-4">
        <FormField
          control={control}
          name="is_available"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0 p-4 border rounded-md">
              <FormLabel>Available for order</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="is_popular"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0 p-4 border rounded-md">
              <FormLabel>Mark as popular item</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <FoodToppingManager foodId={foodId} />
    </>
  );
};

export default FoodFormFields;
