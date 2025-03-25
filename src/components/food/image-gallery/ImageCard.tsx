
import React from 'react';
import { 
  Card, 
  CardContent,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Trash2 } from 'lucide-react';
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

interface FoodImage {
  id: string;
  food_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface ImageCardProps {
  image: FoodImage;
  onDelete: (imageUrl: string, imageId: string) => void;
  onSetPrimary: (imageId: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ 
  image, 
  onDelete, 
  onSetPrimary 
}) => {
  return (
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
            onClick={() => onSetPrimary(image.id)}
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
              <AlertDialogAction 
                onClick={() => onDelete(image.image_url, image.id)} 
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default ImageCard;
