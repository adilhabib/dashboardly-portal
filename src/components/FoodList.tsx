import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFoods, deleteFood } from '@/services/foodService';
import { Food } from '@/types/food';
import FoodCard from './FoodCard';
import FoodModal from './FoodModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';
import PageBreadcrumb from './PageBreadcrumb';

const FoodList: React.FC = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [foodToEdit, setFoodToEdit] = useState<Food | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (location.state?.openAddModal) {
      handleAddFood();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const { data: foods, isLoading, isError } = useQuery({
    queryKey: ['foods'],
    queryFn: fetchFoods,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFood,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
      toast.success('Food item deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting food:', error);
      toast.error('Failed to delete food item');
    },
  });

  const handleAddFood = () => {
    setFoodToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditFood = (food: Food) => {
    setFoodToEdit(food);
    setIsModalOpen(true);
  };

  const handleDeleteFood = (id: string) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFoodToEdit(null);
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading food items...</div>;
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">Error loading food items</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <PageBreadcrumb pageName="Food Menu" />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Food Menu</h1>
        <Button onClick={handleAddFood} className="flex items-center gap-1">
          <Plus size={16} />
          Add New Food
        </Button>
      </div>

      {foods && foods.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((food) => (
            <FoodCard 
              key={food.id} 
              food={food} 
              onEdit={handleEditFood} 
              onDelete={handleDeleteFood} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No food items available</p>
          <Button onClick={handleAddFood} className="mt-4">
            Add Your First Food Item
          </Button>
        </div>
      )}

      {isModalOpen && (
        <FoodModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          food={foodToEdit} 
        />
      )}
    </div>
  );
};

export default FoodList;
