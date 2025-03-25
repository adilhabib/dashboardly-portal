
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Food } from "@/types/food";
import { Edit, Trash2 } from "lucide-react";

interface FoodCardProps {
  food: Food;
  onEdit: (food: Food) => void;
  onDelete: (id: string) => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ food, onEdit, onDelete }) => {
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
          <span className="text-lg font-semibold">PKR {food.price.toFixed(2)}</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        {food.description && <p className="text-sm text-gray-600">{food.description}</p>}
        <div className="mt-2">
          <span className={`px-2 py-1 text-xs rounded-full ${food.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {food.is_available ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-end gap-2">
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
