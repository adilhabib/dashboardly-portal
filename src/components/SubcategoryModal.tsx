
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SubCategory } from '@/types/category';
import { useForm } from 'react-hook-form';
import { useCategories } from '@/hooks/useCategories';

interface SubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subcategory: Omit<SubCategory, 'id'> | SubCategory) => void;
  subcategory: SubCategory | null;
  parentCategoryId?: string;
}

const SubcategoryModal: React.FC<SubcategoryModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  subcategory,
  parentCategoryId
}) => {
  const { categories } = useCategories();
  const isEditing = !!subcategory;

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<Omit<SubCategory, 'id'> | SubCategory>({
    defaultValues: subcategory ? {
      id: subcategory.id,
      name: subcategory.name,
      description: subcategory.description || '',
      parentId: subcategory.parentId
    } : {
      name: '',
      description: '',
      parentId: parentCategoryId || ''
    }
  });

  const selectedParentId = watch('parentId');

  React.useEffect(() => {
    if (isOpen) {
      reset(subcategory ? {
        id: subcategory.id,
        name: subcategory.name,
        description: subcategory.description || '',
        parentId: subcategory.parentId
      } : {
        name: '',
        description: '',
        parentId: parentCategoryId || ''
      });
    }
  }, [isOpen, subcategory, reset, parentCategoryId]);

  const onSubmit = (data: Omit<SubCategory, 'id'> | SubCategory) => {
    if (isEditing && subcategory) {
      onSave({ ...data, id: subcategory.id });
    } else {
      onSave(data);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Subcategory' : 'Add New Subcategory'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="parentId">Parent Category</Label>
            <Select 
              value={selectedParentId} 
              onValueChange={(value) => setValue('parentId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.parentId && (
              <p className="text-sm text-red-500">{errors.parentId.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Subcategory Name</Label>
            <Input
              id="name"
              {...register('name', { required: 'Subcategory name is required' })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...register('description')}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubcategoryModal;
