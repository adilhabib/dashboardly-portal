
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Food } from '@/types/food';

interface FoodHeaderProps {
  food: Food;
}

const FoodHeader: React.FC<FoodHeaderProps> = ({ food }) => {
  return (
    <div className="pb-2">
      <div className="flex justify-between items-center">
        <div>
          <CardTitle className="text-2xl font-bold">{food.name}</CardTitle>
          {food.category && (
            <CardDescription>{food.category}</CardDescription>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={food.is_available ? "default" : "secondary"}>
            {food.is_available ? "Available" : "Unavailable"}
          </Badge>
          <Link to={`/foods?edit=${food.id}`}>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Edit size={16} />
              Edit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FoodHeader;
