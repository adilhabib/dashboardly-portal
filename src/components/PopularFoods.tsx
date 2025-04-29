
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { fetchFoods } from '@/services/foodService';
import { Food } from '@/types/food';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';

const PopularFoods: React.FC = () => {
  const { data: foods, isLoading } = useQuery({
    queryKey: ['foods'],
    queryFn: fetchFoods,
  });

  const popularFoods = foods?.filter(food => food.is_popular) || [];

  if (isLoading) {
    return <div className="text-center py-6">Loading popular items...</div>;
  }

  if (popularFoods.length === 0) {
    return null;
  }

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Star className="text-yellow-500" size={24} />
        <h2 className="text-2xl font-bold">Popular Items</h2>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {popularFoods.map((food) => (
            <CarouselItem key={food.id} className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <Link to={`/food-detail?id=${food.id}`}>
                <Card className="overflow-hidden h-full transition-all hover:shadow-md cursor-pointer">
                  <div className="h-40 overflow-hidden relative">
                    {food.image_url ? (
                      <img 
                        src={food.image_url} 
                        alt={food.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-yellow-400 text-white p-1 rounded-full">
                      <Star size={16} className="fill-current" />
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-medium truncate">{food.name}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-gray-500">
                        {food.category || 'Uncategorized'}
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(food.price)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </div>
  );
};

export default PopularFoods;
