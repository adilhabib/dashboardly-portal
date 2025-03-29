
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, AlertCircle, Edit } from 'lucide-react';
import { FoodDetail } from '@/types/food';
import { Skeleton } from '@/components/ui/skeleton';
import FoodDetailForm from './FoodDetailForm';
import { useFoodSizes } from '@/hooks/useFoodSizes';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency } from '@/lib/utils';

interface FoodDetailsSectionProps {
  price: number;
  details: FoodDetail | null;
  onCreateDetails: () => void;
  isCreatingDetails: boolean;
  foodId: string;
}

const FoodDetailsSection: React.FC<FoodDetailsSectionProps> = ({
  price,
  details,
  onCreateDetails,
  isCreatingDetails,
  foodId
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const { sizes, isLoading: loadingSizes } = useFoodSizes(foodId);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  React.useEffect(() => {
    if (sizes.length > 0) {
      // Find default size or use the first one
      const defaultSize = sizes.find(size => size.is_default) || sizes[0];
      setSelectedSize(defaultSize.id);
    }
  }, [sizes]);
  
  const selectedSizeObject = selectedSize 
    ? sizes.find(size => size.id === selectedSize) 
    : null;
  
  const displayPrice = selectedSizeObject ? selectedSizeObject.price : price;
  
  if (isEditMode && details) {
    return <FoodDetailForm 
      details={details} 
      onCancel={() => setIsEditMode(false)} 
      onSaved={() => setIsEditMode(false)} 
    />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Details</h3>
        {details && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditMode(true)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit Details
          </Button>
        )}
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="text-2xl font-bold mb-3">{formatCurrency(displayPrice)}</div>
        
        {!loadingSizes && sizes.length > 0 && (
          <div className="mb-4">
            <Label className="block mb-2 text-sm font-medium">Select Size</Label>
            <RadioGroup
              value={selectedSize || ''}
              onValueChange={setSelectedSize}
              className="flex flex-col space-y-1"
            >
              <ScrollArea className="h-[120px]">
                <div className="space-y-2 pr-3">
                  {sizes.map((size) => (
                    <div key={size.id} className="flex items-center space-x-2 border rounded-md p-2">
                      <RadioGroupItem value={size.id} id={size.id} />
                      <Label htmlFor={size.id} className="flex-1 flex justify-between items-center">
                        <span>{size.size_name}</span>
                        <span className="font-medium">{formatCurrency(size.price)}</span>
                      </Label>
                      {size.is_default && (
                        <Badge variant="outline" className="bg-green-50">Default</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </RadioGroup>
          </div>
        )}
        
        {details ? (
          <>
            {details.preparation_time && (
              <div className="flex items-center text-gray-600 mb-3">
                <Clock className="h-4 w-4 mr-2" />
                <span>Preparation time: {details.preparation_time} minutes</span>
              </div>
            )}
            
            {details.calories !== null && (
              <div className="mb-3">
                <span className="font-medium">Calories:</span> {details.calories} kcal
              </div>
            )}
            
            {details.ingredients && (
              <div className="mb-3">
                <span className="font-medium">Ingredients:</span>
                <p className="text-gray-600 mt-1 text-sm">{details.ingredients}</p>
              </div>
            )}
            
            {details.allergens && (
              <div className="mb-3">
                <span className="font-medium">Allergens:</span>
                <p className="text-gray-600 mt-1 text-sm">{details.allergens}</p>
              </div>
            )}
          </>
        ) : (
          <div className="py-2">
            <div className="flex items-center text-gray-600 mb-3">
              <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
              <span>No detailed information available</span>
            </div>
            <Button 
              onClick={onCreateDetails} 
              disabled={isCreatingDetails}
              size="sm"
            >
              {isCreatingDetails ? 'Creating...' : 'Add Details'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDetailsSection;
