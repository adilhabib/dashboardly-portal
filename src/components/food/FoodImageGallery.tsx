
import React, { useState } from 'react';
import { useFoodImages } from '@/hooks/useFoodImages';
import {
  GalleryHeader,
  EmptyGallery,
  ImageGalleryCarousel,
  LoadingState
} from './image-gallery';

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
    handleSetPrimary,
    refetch
  } = useFoodImages(foodId);

  const [imageToDelete, setImageToDelete] = useState<{ url: string, id: string } | null>(null);

  const onDelete = (imageUrl: string, imageId: string) => {
    handleDelete(imageUrl, imageId);
  };

  if (!foodId) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Save the food item first to enable image upload.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <GalleryHeader 
        isUploading={isUploading} 
        onRefresh={refetch} 
        onUpload={handleUpload} 
      />

      {isLoading ? (
        <LoadingState />
      ) : images.length === 0 ? (
        <EmptyGallery />
      ) : (
        <ImageGalleryCarousel 
          images={images} 
          onDelete={onDelete} 
          onSetPrimary={handleSetPrimary}
        />
      )}
    </div>
  );
};

export default FoodImageGallery;
