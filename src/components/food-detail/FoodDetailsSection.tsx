
import React from 'react';
import { Clock, Utensils, AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FoodDetail } from '@/types/food';

interface FoodDetailsSectionProps {
  price: number;
  details: FoodDetail | null;
  onCreateDetails: () => void;
  isCreatingDetails: boolean;
  foodId: string | null;
}

const FoodDetailsSection: React.FC<FoodDetailsSectionProps> = ({ 
  price, 
  details, 
  onCreateDetails, 
  isCreatingDetails,
  foodId
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Details</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Price</span>
            <span className="font-medium">PKR {price.toFixed(2)}</span>
          </div>
          
          {details && details.preparation_time && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-500">
                <Clock size={16} />
                <span>Preparation Time</span>
              </div>
              <span className="font-medium">{details.preparation_time} min</span>
            </div>
          )}
          
          {details && details.calories && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Calories</span>
              <span className="font-medium">{details.calories} kcal</span>
            </div>
          )}
        </div>
      </div>
      
      {details && details.ingredients ? (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Utensils size={18} className="text-gray-500" />
            <h3 className="text-lg font-medium">Ingredients</h3>
          </div>
          <p className="text-gray-700">{details.ingredients}</p>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Utensils size={18} className="text-gray-500" />
            <h3 className="text-lg font-medium">Ingredients</h3>
          </div>
          <p className="text-gray-500 italic">No ingredients information available</p>
        </div>
      )}
      
      {details && details.allergens ? (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={18} className="text-amber-500" />
            <h3 className="text-lg font-medium">Allergens</h3>
          </div>
          <p className="text-gray-700">{details.allergens}</p>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={18} className="text-amber-500" />
            <h3 className="text-lg font-medium">Allergens</h3>
          </div>
          <p className="text-gray-500 italic">No allergens information available</p>
        </div>
      )}

      {!details && foodId && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">No detailed information available for this food item</p>
            <Button 
              size="sm" 
              onClick={onCreateDetails}
              disabled={isCreatingDetails}
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              {isCreatingDetails ? 'Creating...' : 'Create Details'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodDetailsSection;
