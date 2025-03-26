
import React from 'react';
import { useFoodImages } from '@/hooks/useFoodImages';
import { Loader2 } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import ImageUploader from './gallery/ImageUploader';
import FoodImageCard from './gallery/FoodImageCard';
import EmptyGalleryState from './gallery/EmptyGalleryState';

interface FoodImageGalleryProps {
  foodId: string | null;
}

const FoodImageGallery: React.FC<FoodImageGalleryProps> = ({ foodId }) => {
  const {
    images,
    isLoading,
    isUploading,
    handleUpload,
    handleDelete,
    handleSetPrimary
  } = useFoodImages(foodId);

  if (!foodId) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Save the food item first to enable image upload.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Food Images</h3>
        <ImageUploader 
          foodId={foodId}
          isUploading={isUploading}
          onUpload={handleUpload}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : images.length === 0 ? (
        <EmptyGalleryState />
      ) : (
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image) => (
              <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                <FoodImageCard
                  id={image.id}
                  imageUrl={image.image_url}
                  isPrimary={image.is_primary}
                  onSetPrimary={() => handleSetPrimary(image.id)}
                  onDelete={() => handleDelete(image.image_url, image.id)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-1" />
              <CarouselNext className="right-1" />
            </>
          )}
        </Carousel>
      )}
    </div>
  );
};

export default FoodImageGallery;
