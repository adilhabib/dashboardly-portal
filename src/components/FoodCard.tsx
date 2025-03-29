
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Food } from "@/types/food";
import { Edit, Trash2, Eye } from "lucide-react";
import { useFoodSizes } from '@/hooks/useFoodSizes';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface FoodCardProps {
  food: Food;
  onEdit: (food: Food) => void;
  onDelete: (id: string) => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ food, onEdit, onDelete }) => {
  const { sizes, isLoading } = useFoodSizes(food.id);
  
  return (
    <Card className="overflow-hidden">
      {food.image_url ? (
        <div className="h-48 overflow-hidden">
          <img 
            src={food.image_url} 
            alt={food.name} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      ) : (
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No image available</span>
        </div>
      )}
      
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{food.name}</CardTitle>
            {food.category && (
              <CardDescription className="text-sm">{food.category}</CardDescription>
            )}
          </div>
          <span className="text-lg font-semibold">{formatCurrency(food.price)}</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        {food.description && <p className="text-sm text-gray-600">{food.description}</p>}
        
        <div className="mt-3">
          {!isLoading && sizes.length > 0 && (
            <div className="mb-2">
              <p className="text-xs text-muted-foreground mb-1">Available sizes:</p>
              <div className="flex flex-wrap gap-1">
                {sizes.map((size) => (
                  <Badge 
                    key={size.id} 
                    variant={size.is_default ? "default" : "outline"}
                    className="text-xs"
                  >
                    {size.size_name}: {formatCurrency(size.price)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <span className={`px-2 py-1 mt-2 inline-block text-xs rounded-full ${food.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {food.is_available ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-end gap-2">
        <Link to={`/food-detail?id=${food.id}`}>
          <Button size="sm" variant="outline">
            <Eye size={16} className="mr-1" />
            View
          </Button>
        </Link>
        <Button size="sm" variant="outline" onClick={() => onEdit(food)}>
          <Edit size={16} className="mr-1" />
          Edit
        </Button>
        <Button size="sm" variant="outline" className="text-red-500" onClick={() => onDelete(food.id)}>
          <Trash2 size={16} className="mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FoodCard;
