
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Category } from '@/types/category';
import { useForm } from 'react-hook-form';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, 'id'> | Category) => void;
  category: Category | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  category 
}) => {
  const isEditing = !!category;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Omit<Category, 'id'> | Category>({
    defaultValues: category ? {
      id: category.id,
      name: category.name,
      description: category.description || '',
    } : {
      name: '',
      description: '',
    }
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(category ? {
        id: category.id,
        name: category.name,
        description: category.description || '',
      } : {
        name: '',
        description: '',
      });
    }
  }, [isOpen, category, reset]);

  const onSubmit = (data: Omit<Category, 'id'> | Category) => {
    if (isEditing && category) {
      onSave({ ...data, id: category.id });
    } else {
      onSave(data);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              {...register('name', { required: 'Category name is required' })}
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

export default CategoryModal;
