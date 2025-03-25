
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ImageIcon } from 'lucide-react';

const EmptyGallery: React.FC = () => {
  return (
    <Card className="border-dashed bg-muted/50">
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No images uploaded yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Click "Upload Image" to add photos
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyGallery;
