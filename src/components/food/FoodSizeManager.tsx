
import React, { useState } from 'react';
import { PlusCircle, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FoodSize } from '@/types/food';
import { useFoodSizes } from '@/hooks/useFoodSizes';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface FoodSizeManagerProps {
  foodId: string | null;
  onPriceChange?: (price: number) => void;
}

const FoodSizeManager: React.FC<FoodSizeManagerProps> = ({ foodId, onPriceChange }) => {
  const [newSize, setNewSize] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const { 
    sizes, 
    isLoading, 
    createSize, 
    deleteSize, 
    setDefaultSize, 
    isCreating, 
    isDeleting,
    isSettingDefault 
  } = useFoodSizes(foodId);

  const handleAddSize = () => {
    if (!foodId) return;
    if (!newSize.trim()) {
      toast.error('Please enter a size name');
      return;
    }
    
    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    createSize({
      food_id: foodId,
      size_name: newSize.trim(),
      price,
      is_default: sizes.length === 0 ? true : false
    });

    setNewSize('');
    setNewPrice('');
  };

  const handleSetDefault = (size: FoodSize) => {
    if (!foodId) return;
    setDefaultSize({ foodId, sizeId: size.id });
    if (onPriceChange) {
      onPriceChange(size.price);
    }
  };

  if (!foodId) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg">Food Sizes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Save the food item first to add sizes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Food Sizes</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading sizes...</div>
        ) : (
          <>
            <div className="space-y-2 mb-4">
              {sizes.length === 0 ? (
                <p className="text-sm text-muted-foreground mb-4">
                  No sizes defined yet. Add a size below.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {sizes.map((size) => (
                    <div 
                      key={size.id} 
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{size.size_name}</span>
                        <span className="text-sm text-muted-foreground">${size.price.toFixed(2)}</span>
                        {size.is_default && (
                          <Badge variant="outline" className="bg-green-50">Default</Badge>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {!size.is_default && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0" 
                            onClick={() => handleSetDefault(size)}
                            disabled={isSettingDefault}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0 text-red-500" 
                          onClick={() => deleteSize(size.id)}
                          disabled={isDeleting || (size.is_default && sizes.length > 1)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="size-name">Size Name</Label>
                  <Input
                    id="size-name"
                    placeholder="e.g., Small, Medium, Large"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="size-price">Price ($)</Label>
                  <Input
                    id="size-price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={handleAddSize} 
                className="w-full"
                disabled={isCreating}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Size
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodSizeManager;
