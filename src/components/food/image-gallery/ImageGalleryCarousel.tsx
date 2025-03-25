
import React from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import ImageCard from './ImageCard';

interface FoodImage {
  id: string;
  food_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface ImageGalleryCarouselProps {
  images: FoodImage[];
  onDelete: (imageUrl: string, imageId: string) => void;
  onSetPrimary: (imageId: string) => void;
}

const ImageGalleryCarousel: React.FC<ImageGalleryCarouselProps> = ({
  images,
  onDelete,
  onSetPrimary
}) => {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((image) => (
          <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
            <ImageCard 
              image={image} 
              onDelete={onDelete} 
              onSetPrimary={onSetPrimary}
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
  );
};

export default ImageGalleryCarousel;
