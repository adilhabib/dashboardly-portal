
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface GalleryHeaderProps {
  isUploading: boolean;
  onRefresh: () => void;
  onUpload: (file: File) => Promise<void>;
}

const GalleryHeader: React.FC<GalleryHeaderProps> = ({
  isUploading,
  onRefresh,
  onUpload
}) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">Food Images</h3>
      <div className="flex gap-2">
        <Button 
          onClick={onRefresh} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-3 w-3" />
          Refresh
        </Button>
        <ImageUploader isUploading={isUploading} onUpload={onUpload} />
      </div>
    </div>
  );
};

export default GalleryHeader;
