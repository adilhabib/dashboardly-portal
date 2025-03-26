
import React from 'react';
import { Food } from '@/types/food';

interface FoodImageSectionProps {
  food: Food;
}

const FoodImageSection: React.FC<FoodImageSectionProps> = ({ food }) => {
  return (
    <div>
      {food.image_url ? (
        <img 
          src={food.image_url} 
          alt={food.name} 
          className="w-full h-60 object-cover rounded-md mb-4"
        />
      ) : (
        <div className="w-full h-60 bg-gray-200 rounded-md flex items-center justify-center mb-4">
          <p className="text-gray-500">No image available</p>
        </div>
      )}
      
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Description</h3>
        <p className="text-gray-700">{food.description || 'No description provided'}</p>
      </div>
    </div>
  );
};

export default FoodImageSection;
