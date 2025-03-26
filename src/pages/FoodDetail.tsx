
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { useFoodDetail } from '@/hooks/useFoodDetail';
import { 
  FoodHeader, 
  FoodImageSection, 
  FoodDetailsSection, 
  FoodStats,
  BackButton
} from '@/components/food-detail';

const FoodDetail = () => {
  const [searchParams] = useSearchParams();
  const foodId = searchParams.get('id');
  
  const { 
    food, 
    details, 
    isLoading, 
    isError, 
    createDetails, 
    isCreatingDetails 
  } = useFoodDetail(foodId);

  if (isLoading) {
    return <div className="text-center py-10">Loading food details...</div>;
  }

  if (isError || !food) {
    return <div className="text-center py-10 text-red-500">Error loading food details</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageBreadcrumb pageName="Food Details" />
      
      <BackButton />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-sm mb-6">
            <CardHeader className="pb-2">
              <FoodHeader food={food} />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FoodImageSection food={food} />
                <FoodDetailsSection 
                  price={food.price}
                  details={details}
                  onCreateDetails={() => foodId && createDetails(foodId)}
                  isCreatingDetails={isCreatingDetails}
                  foodId={foodId}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <FoodStats />
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
