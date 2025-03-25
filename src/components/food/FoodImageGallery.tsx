
import React, { useState, useRef } from 'react';
import { useFoodImages } from '@/hooks/useFoodImages';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardFooter 
} from '@/components/ui/card';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { 
  Upload, 
  Trash2, 
  Star, 
  Image as ImageIcon,
  Loader2,
  RefreshCw
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageToDelete, setImageToDelete] = useState<{ url: string, id: string } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    await handleUpload(file);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const confirmDelete = (imageUrl: string, imageId: string) => {
    setImageToDelete({ url: imageUrl, id: imageId });
  };

  const executeDelete = () => {
    if (imageToDelete) {
      handleDelete(imageToDelete.url, imageToDelete.id);
      setImageToDelete(null);
    }
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Food Images</h3>
        <div className="flex gap-2">
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Image
              </>
            )}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : images.length === 0 ? (
        <Card className="border-dashed bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No images uploaded yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Click "Upload Image" to add photos
            </p>
          </CardContent>
        </Card>
      ) : (
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image) => (
              <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden">
                  <CardContent className="p-0 aspect-square relative">
                    <img 
                      src={image.image_url} 
                      alt="Food" 
                      className="w-full h-full object-cover"
                    />
                    {image.is_primary && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white rounded-full p-1">
                        <Star className="h-4 w-4" />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-2 flex justify-between">
                    {!image.is_primary && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-yellow-500" 
                        onClick={() => handleSetPrimary(image.id)}
                      >
                        <Star className="h-4 w-4 mr-1" />
                        Set as Main
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 ml-auto"
                          onClick={() => confirmDelete(image.image_url, image.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Image</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this image? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={executeDelete} className="bg-red-500 hover:bg-red-600">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
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
