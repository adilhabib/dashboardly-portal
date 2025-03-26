
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react"; // Changed from ExclamationTriangleIcon
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
    error,
    createDetails, 
    isCreatingDetails 
  } = useFoodDetail(foodId);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-10 text-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
        <div className="h-64 w-full max-w-2xl bg-gray-200 rounded mb-4"></div>
        <div className="h-32 w-full max-w-2xl bg-gray-200 rounded"></div>
      </div>
      <p className="mt-4 text-gray-500">Loading food details...</p>
    </div>;
  }

  if (isError || !food) {
    return <div className="container mx-auto px-4 py-6">
      <PageBreadcrumb pageName="Food Details" />
      <BackButton />
      
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" /> {/* Changed from ExclamationTriangleIcon */}
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error instanceof Error 
            ? error.message 
            : "Unable to load food details. Please try again later."}
        </AlertDescription>
      </Alert>
      
      <div className="text-center py-10">
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    </div>;
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
